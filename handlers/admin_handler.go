package handlers

import (
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

func AdminGetUsers(c *fiber.Ctx) error {

	var users []models.User

	if err := config.DB.Find(&users).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch users",
		})
	}

	return c.JSON(users)
}

func AdminDeleteUser(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	if err := config.DB.Delete(&models.User{}, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to delete user",
		})
	}

	return c.JSON(fiber.Map{
		"message": "user deleted",
	})
}

func AdminGetProjects(c *fiber.Ctx) error {

	var projects []models.Project

	if err := config.DB.Find(&projects).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch projects",
		})
	}

	return c.JSON(projects)
}

func AdminDeleteProject(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	if err := config.DB.Delete(&models.Project{}, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to delete project",
		})
	}

	return c.JSON(fiber.Map{
		"message": "project deleted",
	})
}

func AdminGetPayments(c *fiber.Ctx) error {

	var payments []models.Payment

	if err := config.DB.Find(&payments).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch payments",
		})
	}

	return c.JSON(payments)
}

func AdminGetReviews(c *fiber.Ctx) error {

	var reviews []models.Review

	if err := config.DB.Find(&reviews).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch reviews",
		})
	}

	return c.JSON(reviews)
}