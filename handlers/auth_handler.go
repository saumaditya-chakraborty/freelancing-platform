package handlers

import (
	"freelancing-platform/config"
	"freelancing-platform/models"
	"freelancing-platform/utils"

	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {

	var loginData models.LoginRequest

	if err := c.BodyParser(&loginData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	var user models.User

	if err := config.DB.
		Where("email = ?", loginData.Email).
		First(&user).Error; err != nil {

		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	if !utils.CheckPassword(loginData.Password, user.Password) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	// =========================================
	// Check if user is banned
	// =========================================

	if user.IsBanned {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Your account has been permanently banned. Please contact the administrator.",
		})
	}

	// =========================================
	// Generate JWT
	// =========================================

	token, err := utils.GenerateToken(
		user.ID,
		user.Email,
		user.Role,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not generate token",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"token":   token,
		"user": fiber.Map{
			"id":           user.ID,
			"name":         user.Name,
			"email":        user.Email,
			"role":         user.Role,
			"is_blocked":   user.IsBlocked,
			"is_banned":    user.IsBanned,
			"averageRating": user.AverageRating,
			"totalReviews":  user.TotalReviews,
		},
	})
}