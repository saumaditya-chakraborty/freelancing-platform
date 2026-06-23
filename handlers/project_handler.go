package handlers

import (
	"strconv"
	"fmt"
	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

func CreateProject(c *fiber.Ctx) error {

	var project models.Project
	clientID, _ := c.Locals("userID").(uint)

	if err := c.BodyParser(&project); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	// default business rule
	project.ClientID = clientID
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

	var response []fiber.Map

	for _, project := range projects {

		var proposalCount int64

		config.DB.
			Model(&models.Proposal{}).
			Where("project_id = ?", project.ID).
			Count(&proposalCount)

		response = append(response, fiber.Map{
			"id":             project.ID,
			"title":          project.Title,
			"description":    project.Description,
			"budget":         project.Budget,
			"client_id":      project.ClientID,
			"status":         project.Status,
			"proposal_count": proposalCount,
		})
	}

	return c.JSON(response)
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
	clientID, _ := c.Locals("userID").(uint)

	if err := config.DB.First(&project, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "project not found",
		})
	}
	if project.ClientID != clientID {
		return c.Status(403).JSON(fiber.Map{
			"error": "not your project",
		})
	}

	project.Title = updatedProject.Title
	project.Description = updatedProject.Description
	project.Budget = updatedProject.Budget

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
	clientID, _ := c.Locals("userID").(uint)

	if err := config.DB.First(&project, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "project not found",
		})
	}
	if project.ClientID != clientID {
		return c.Status(403).JSON(fiber.Map{
			"error": "not your project",
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

func UpdateProjectStatus(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid project id",
		})
	}

	var body struct {
		Status string `json:"status"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}
fmt.Println("Received status:", body.Status)
	var project models.Project

	if err := config.DB.First(&project, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "project not found",
		})
	}

	project.Status = body.Status

	if err := config.DB.Save(&project).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to update status",
		})
	}

	return c.JSON(project)
}
