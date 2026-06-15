package handlers

import (
	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

type LeaveReviewRequest struct {
	ProjectID  uint   `json:"project_id"`
	RevieweeID uint   `json:"reviewee_id"`
	Rating     int    `json:"rating"`
	Comment    string `json:"comment"`
}

// LeaveReview handles peer feedback loops for project contracts
func LeaveReview(c *fiber.Ctx) error {
	reviewerID, _ := c.Locals("userID").(uint)

	var req LeaveReviewRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid payload"})
	}

	// Verify project exists
	var project models.Project
	if err := config.DB.First(&project, req.ProjectID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Project not found"})
	}

	// Status check removed entirely — reviews can be left directly!

	review := models.Review{
		ProjectID:  req.ProjectID,
		ReviewerID: reviewerID,
		RevieweeID: req.RevieweeID,
		Rating:     req.Rating,
		Comment:    req.Comment,
	}

	if err := config.DB.Create(&review).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save review"})
	}

	return c.Status(fiber.StatusCreated).JSON(review)
}