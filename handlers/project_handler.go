package handlers

import (
	"strconv" // used for strring to number conversion 

	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

var Projects []models.Project

func CreateProject(c *fiber.Ctx) error {
	var project models.Project

	if err := c.BodyParser(&project); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	Projects = append(Projects, project)

	return c.Status(201).JSON(project)
}

func GetProjects(c *fiber.Ctx) error {
	return c.JSON(Projects)
}

func GetProjectByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	for _, project := range Projects {
		if project.ID == id {
			return c.JSON(project)
		}
	}

	return c.Status(404).JSON(fiber.Map{
		"error": "project not found",
	})
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

	for i, project := range Projects {
		if project.ID == id {
			Projects[i] = updatedProject
			return c.JSON(updatedProject)
		}
	}

	return c.Status(404).JSON(fiber.Map{
		"error": "project not found",
	})
}

func DeleteProject(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	for i, project := range Projects {
		if project.ID == id {
			Projects = append(Projects[:i], Projects[i+1:]...)

			return c.JSON(fiber.Map{
				"message": "project deleted",
			})
		}
	}

	return c.Status(404).JSON(fiber.Map{
		"error": "project not found",
	})
}