package handlers

import (
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"
	"freelancing-platform/services"

	"github.com/gofiber/fiber/v2"
)

type CreateMilestoneRequest struct {
	Title  string `json:"title"`
	Amount int    `json:"amount"`
}

// CreateMilestone allows clients to divide an in-progress project budget into phases
func CreateMilestone(c *fiber.Ctx) error {

	clientID, _ := c.Locals("userID").(uint)

	projectID, err := strconv.Atoi(c.Params("projectId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid project ID"})
	}

	var project models.Project
	if err := config.DB.First(&project, projectID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Project not found"})
	}

	// SECURITY: Only project owner can create milestones
	if project.ClientID != clientID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access Denied: Ownership mismatch"})
	}

	var req CreateMilestoneRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}
	if req.Title == "" || req.Amount <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Title and positive amount are required"})
	}

	milestone := models.Milestone{
		ProjectID: uint(projectID),
		Title:     req.Title,
		Amount:    req.Amount,
		Status:    "pending",
	}

	if err := config.DB.Create(&milestone).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create milestone"})
	}

	// 💰 ESCROW: Lock money immediately when milestone is created
	if err := services.HoldInEscrow(
		clientID,
		req.Amount,
		"milestone_"+strconv.Itoa(int(milestone.ID)),
	); err != nil {
		config.DB.Delete(&milestone)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(milestone)
}

// SubmitMilestone allows freelancer to submit work
func SubmitMilestone(c *fiber.Ctx) error {

	freelancerID, _ := c.Locals("userID").(uint)

	milestoneID, err := strconv.Atoi(c.Params("milestoneId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid milestone ID"})
	}

	var milestone models.Milestone
	if err := config.DB.First(&milestone, milestoneID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Milestone not found"})
	}

	// Verify freelancer is hired
	var proposal models.Proposal
	err = config.DB.Where(
		"project_id = ? AND status = ?",
		milestone.ProjectID,
		"accepted",
	).First(&proposal).Error

	if err != nil || proposal.FreelancerID != freelancerID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access Denied: You are not the hired freelancer"})
	}

	if milestone.Status != "pending" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Milestone already processed"})
	}

	config.DB.Model(&milestone).Update("status", "submitted")

	return c.JSON(fiber.Map{"message": "Work submitted successfully for review"})
}

// ReleaseMilestoneFunds approves milestone and releases escrow
func ReleaseMilestoneFunds(c *fiber.Ctx) error {

	clientID, _ := c.Locals("userID").(uint)

	milestoneID, err := strconv.Atoi(c.Params("milestoneId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid milestone ID"})
	}

	var milestone models.Milestone
	if err := config.DB.Preload("Project").First(&milestone, milestoneID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Milestone not found"})
	}

	// Only project owner can approve
	if milestone.Project.ClientID != clientID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access Denied: Ownership mismatch"})
	}
	if milestone.Status != "submitted" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Milestone must be submitted before funds are released"})
	}

	// Get freelancer
	var proposal models.Proposal
	err = config.DB.Where(
		"project_id = ? AND status = ?",
		milestone.ProjectID,
		"accepted",
	).First(&proposal).Error

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "No accepted freelancer found"})
	}

	// 💰 RELEASE ESCROW TO FREELANCER
	if err := services.ReleaseEscrow(
		clientID,
		proposal.FreelancerID,
		milestone.Amount,
		"milestone_"+strconv.Itoa(int(milestone.ID)),
	); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Mark milestone approved
	if err := config.DB.Model(&milestone).Update("status", "approved").Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update milestone"})
	}

	return c.JSON(fiber.Map{
		"message": "Milestone approved. Funds released to freelancer.",
	})
}
