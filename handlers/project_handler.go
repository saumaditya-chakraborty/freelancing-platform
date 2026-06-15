package handlers

import (
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

func CreateProject(c *fiber.Ctx) error {

	var project models.Project

	if err := c.BodyParser(&project); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	// default business rule
	project.Status = "open"

	if err := config.DB.Create(&project).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to create project",
		})
	}

	return c.Status(201).JSON(project)
}

func GetProjects(c *fiber.Ctx) error {

	var projects []models.Project

	if err := config.DB.Find(&projects).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch projects",
		})
	}

	return c.JSON(projects)
}

func GetProjectByID(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	var project models.Project

	if err := config.DB.First(&project, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "project not found",
		})
	}

	return c.JSON(project)
}

func UpdateProject(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	var updatedProject models.Project

	if err := c.BodyParser(&updatedProject); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	var project models.Project

	if err := config.DB.First(&project, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "project not found",
		})
	}

	project.Title = updatedProject.Title
	project.Description = updatedProject.Description
	project.Budget = updatedProject.Budget
	project.ClientID = updatedProject.ClientID

	if err := config.DB.Save(&project).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to update project",
		})
	}

	return c.JSON(project)
}

func DeleteProject(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	var project models.Project

	if err := config.DB.First(&project, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "project not found",
		})
	}

	if err := config.DB.Delete(&project).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to delete project",
		})
	}

	return c.JSON(fiber.Map{
		"message": "project deleted",
	})
}