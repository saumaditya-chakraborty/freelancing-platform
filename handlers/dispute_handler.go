package handlers

import (
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

type FileDisputeRequest struct {
	ProjectID uint   `json:"project_id"`
	Reason    string `json:"reason"`
}

type ResolveDisputeRequest struct {
	Resolution string `json:"resolution"`
	Status     string `json:"status"` // resolved, dismissed
}

// FileDispute allows an involved counterparty to freeze an active project and request admin arbitration
func FileDispute(c *fiber.Ctx) error {
	userID, _ := c.Locals("userID").(uint)

	var req FileDisputeRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	var project models.Project
	if err := config.DB.First(&project, req.ProjectID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Project not found"})
	}

	// Verify if user is the assigned contractor
	var proposal models.Proposal
	isFreelancer := config.DB.Where("project_id = ? AND status = ? AND freelancer_id = ?", project.ID, "accepted", userID).First(&proposal).Error == nil

	// SECURE: Verify caller is part of the contract (either the project owner client or hired freelancer)
	if project.ClientID != userID && !isFreelancer {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access Denied: You are not linked to this contract"})
	}

	// ATOMIC TRANSACTION: Lock project status and log dispute entry simultaneously
	tx := config.DB.Begin()

	if err := tx.Model(&project).Update("status", "disputed").Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to change contract lock state"})
	}

	dispute := models.Dispute{
		ProjectID:  project.ID,
		RaisedByID: userID,
		Reason:     req.Reason,
		Status:     "open",
	}

	if err := tx.Create(&dispute).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "A dispute file already exists for this project"})
	}

	tx.Commit()
	return c.Status(fiber.StatusCreated).JSON(dispute)
}

// ResolveDispute allows an admin account to close a case file and decide on contract termination status
func ResolveDispute(c *fiber.Ctx) error {
	disputeID, _ := strconv.Atoi(c.Params("disputeId"))

	var req ResolveDisputeRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid payload"})
	}

	var dispute models.Dispute
	if err := config.DB.Preload("Project").First(&dispute, disputeID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Dispute case not found"})
	}

	tx := config.DB.Begin()

	dispute.Resolution = req.Resolution
	dispute.Status = req.Status

	if err := tx.Save(&dispute).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update dispute resolution log"})
	}

	// Transition project state based on admin ruling parameters
	finalProjectStatus := "in_progress"
	if req.Status == "resolved" {
		finalProjectStatus = "completed" // Payout closed by arbitration
	}

	if err := tx.Model(&dispute.Project).Update("status", finalProjectStatus).Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to release project lock status"})
	}

	tx.Commit()
	return c.JSON(fiber.Map{"message": "Dispute case resolved successfully by admin ruling"})
}