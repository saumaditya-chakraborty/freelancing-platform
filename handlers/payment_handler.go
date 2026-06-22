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

	// ❌ prevent double payment
	if milestone.Status == "paid" {
		return c.Status(400).JSON(fiber.Map{
			"error": "milestone already paid",
		})
	}

	if milestone.Status != "approved" {
		return c.Status(400).JSON(fiber.Map{
			"error": "milestone must be approved first",
		})
	}

	// create payment record
	payment := models.Payment{
		ProjectID:   milestone.ProjectID,
		MilestoneID: milestone.ID,
		Amount:      milestone.Amount,
		Status:      "paid",
	}

	tx := config.DB.Begin()

	if err := tx.Create(&payment).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to create payment",
		})
	}

	// update milestone status
	if err := tx.Model(&milestone).Update("status", "paid").Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to update milestone",
		})
	}

	tx.Commit()

	return c.JSON(fiber.Map{
		"message": "payment released successfully",
		"payment": payment,
	})
}
func GetPayments(c *fiber.Ctx) error {

	var payments []models.Payment

	if err := config.DB.Preload("Project").Find(&payments); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch payments",
		})
	}

	return c.JSON(payments)
}