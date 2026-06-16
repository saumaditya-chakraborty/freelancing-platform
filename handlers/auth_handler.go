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
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	var user models.User

	if err := config.DB.Where(
		"email = ?",
		loginData.Email,
	).First(&user).Error; err != nil {

		return c.Status(401).JSON(fiber.Map{
			"error": "invalid credentials",
		})
	}

	if !utils.CheckPassword(
		loginData.Password,
		user.Password,
	) {
		return c.Status(401).JSON(fiber.Map{
			"error": "invalid credentials",
		})
	}

	token, err := utils.GenerateToken(
		user.ID,
		user.Email,
		user.Role,
	)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "could not generate token",
		})
	}

	return c.JSON(fiber.Map{
		"message": "login successful",
		"token":   token,
		"user": fiber.Map{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
