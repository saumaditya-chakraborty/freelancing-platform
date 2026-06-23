package handlers

import (
	"freelancing-platform/config"
	"freelancing-platform/models"
	"freelancing-platform/utils"

	"github.com/gofiber/fiber/v2"
)

func GoogleLogin(c *fiber.Ctx) error {

	var body struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request",
		})
	}

	var user models.User

	err := config.DB.
		Where("email = ?", body.Email).
		First(&user).Error

	if err != nil {

		user = models.User{
			Name:     body.Name,
			Email:    body.Email,
			Role:     "client",
			Password: "",
		}

		config.DB.Create(&user)
	}

	token, _ := utils.GenerateToken(
		user.ID,
		user.Email,
		user.Role,
	)

	return c.JSON(fiber.Map{
		"token": token,
		"user":  user,
	})
}