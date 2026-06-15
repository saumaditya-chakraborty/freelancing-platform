package handlers

import (
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"

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

	// SECURE: Enforce that only the client who posted the project can create milestones
	if project.ClientID != clientID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access Denied: Ownership mismatch"})
	}

	var req CreateMilestoneRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
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

	return c.Status(fiber.StatusCreated).JSON(milestone)
}

// SubmitMilestone allows the assigned freelancer to submit work for a milestone
func SubmitMilestone(c *fiber.Ctx) error {
	freelancerID, _ := c.Locals("userID").(uint)
	milestoneID, _ := strconv.Atoi(c.Params("milestoneId"))

	var milestone models.Milestone
	if err := config.DB.First(&milestone, milestoneID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Milestone not found"})
	}

	// SECURE: Verify this specific freelancer was actually hired for this project
	var proposal models.Proposal
	err := config.DB.Where("project_id = ? AND status = ?", milestone.ProjectID, "accepted").First(&proposal).Error
	if err != nil || proposal.FreelancerID != freelancerID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access Denied: You are not the hired freelancer"})
	}

	if milestone.Status != "pending" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Milestone is already submitted or approved"})
	}

	config.DB.Model(&milestone).Update("status", "submitted")
	return c.JSON(fiber.Map{"message": "Work submitted successfully for client review"})
}

// ReleaseMilestoneFunds lets clients approve submitted work and unlock escrow funds
func ReleaseMilestoneFunds(c *fiber.Ctx) error {
	clientID, _ := c.Locals("userID").(uint)
	milestoneID, _ := strconv.Atoi(c.Params("milestoneId"))

	var milestone models.Milestone
	if err := config.DB.Preload("Project").First(&milestone, milestoneID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Milestone not found"})
	}

	if milestone.Project.ClientID != clientID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access Denied: Ownership mismatch"})
	}

	// Update state to approved
	if err := config.DB.Model(&milestone).Update("status", "approved").Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to release funds"})
	}

	return c.JSON(fiber.Map{"message": "Milestone approved. Funds released to freelancer balance!"})
}