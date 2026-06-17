package handlers

import (
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

func ReleasePayment(c *fiber.Ctx) error {

	milestoneID, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid milestone id",
		})
	}

	var milestone models.Milestone

	if err := config.DB.First(&milestone, milestoneID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "milestone not found",
		})
	}

	if milestone.Status != "approved" {
		return c.Status(400).JSON(fiber.Map{
			"error": "milestone must be approved first",
		})
	}

	payment := models.Payment{
		ProjectID:   milestone.ProjectID,
		MilestoneID: milestone.ID,
		Amount:      milestone.Amount,
		Status:      "paid",
	}

	if err := config.DB.Create(&payment).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to create payment",
		})
	}

	return c.JSON(fiber.Map{
		"message": "payment released successfully",
		"payment": payment,
	})
}

func GetPayments(c *fiber.Ctx) error {

	var payments []models.Payment

	if err := config.DB.Find(&payments).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch payments",
		})
	}

	return c.JSON(payments)
}