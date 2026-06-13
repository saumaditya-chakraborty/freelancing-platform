package handlers

import (
	"strconv"

	"freelancing-platform/models"
	"freelancing-platform/utils"

	"github.com/gofiber/fiber/v2"
)

var Users []models.User

func CreateUser(c *fiber.Ctx) error {

	var user models.User

	if err := c.BodyParser(&user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	hashedPassword, err := utils.HashPassword(user.Password)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to hash password",
		})
	}

	user.Password = hashedPassword

	Users = append(Users, user)

	return c.Status(201).JSON(user)
}

func GetUsers(c *fiber.Ctx) error {
	return c.JSON(Users)
}

func GetUserByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	for _, user := range Users {
		if user.ID == id {
			return c.JSON(user)
		}
	}

	return c.Status(404).JSON(fiber.Map{
		"error": "user not found",
	})
}

func UpdateUser(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	var updatedUser models.User

	if err := c.BodyParser(&updatedUser); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	for i, user := range Users {
		if user.ID == id {
			Users[i] = updatedUser
			return c.JSON(updatedUser)
		}
	}

	return c.Status(404).JSON(fiber.Map{
		"error": "user not found",
	})
}

func DeleteUser(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	for i, user := range Users {
		if user.ID == id {
			Users = append(Users[:i], Users[i+1:]...)

			return c.JSON(fiber.Map{
				"message": "user deleted",
			})
		}
	}

	return c.Status(404).JSON(fiber.Map{
		"error": "user not found",
	})
}