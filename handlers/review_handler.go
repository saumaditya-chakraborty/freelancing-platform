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

func LeaveReview(c *fiber.Ctx) error {

	reviewerID, _ := c.Locals("userID").(uint)

	var req LeaveReviewRequest

	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	if req.Rating < 1 || req.Rating > 5 {
		return c.Status(400).JSON(fiber.Map{
			"error": "rating must be between 1 and 5",
		})
	}

	var project models.Project

	if err := config.DB.First(&project, req.ProjectID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "project not found",
		})
	}

	if project.Status != "completed" {
		return c.Status(400).JSON(fiber.Map{
			"error": "project must be completed before review",
		})
	}

	var existingReview models.Review

	if err := config.DB.Where(
		"project_id = ? AND reviewer_id = ?",
		req.ProjectID,
		reviewerID,
	).First(&existingReview).Error; err == nil {

		return c.Status(400).JSON(fiber.Map{
			"error": "review already submitted",
		})
	}

	review := models.Review{
		ProjectID:  req.ProjectID,
		ReviewerID: reviewerID,
		RevieweeID: req.RevieweeID,
		Rating:     req.Rating,
		Comment:    req.Comment,
	}

	if err := config.DB.Create(&review).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to create review",
		})
	}

	return c.Status(201).JSON(review)
}

func GetReviews(c *fiber.Ctx) error {

	userID := c.Params("userId")

	var reviews []models.Review

	if err := config.DB.Where(
		"reviewee_id = ?",
		userID,
	).Find(&reviews).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch reviews",
		})
	}

	return c.JSON(reviews)
}