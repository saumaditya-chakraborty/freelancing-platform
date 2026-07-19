package handlers

import (
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

func GetNotifications(c *fiber.Ctx) error {

	userID, _ := c.Locals("userID").(uint)

	var notifications []models.Notification

	if err := config.DB.
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&notifications).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch notifications",
		})
	}

	return c.JSON(notifications)
}

func MarkNotificationRead(c *fiber.Ctx) error {

	userID, _ := c.Locals("userID").(uint)

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid notification id",
		})
	}

	var notification models.Notification

	if err := config.DB.First(&notification, id).Error; err != nil {

		return c.Status(404).JSON(fiber.Map{
			"error": "notification not found",
		})
	}

	if notification.UserID != userID {

		return c.Status(403).JSON(fiber.Map{
			"error": "access denied",
		})
	}

	notification.IsRead = true

	if err := config.DB.Save(&notification).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to update notification",
		})
	}

	return c.JSON(notification)
}