package handlers

import (
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

func CreateMilestone(c *fiber.Ctx) error {

	projectID, err := strconv.Atoi(c.Params("projectId"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid project id",
		})
	}

	var milestone models.Milestone

	if err := c.BodyParser(&milestone); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	milestone.ProjectID = uint(projectID)
	milestone.Status = "pending"

	if err := config.DB.Create(&milestone).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to create milestone",
		})
	}

	return c.Status(201).JSON(milestone)
}

func GetMilestones(c *fiber.Ctx) error {

	projectID, err := strconv.Atoi(c.Params("projectId"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid project id",
		})
	}

	var milestones []models.Milestone

	if err := config.DB.Where(
		"project_id = ?",
		projectID,
	).Find(&milestones).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch milestones",
		})
	}

	return c.JSON(milestones)
}

func SubmitMilestone(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid milestone id",
		})
	}

	var milestone models.Milestone

	if err := config.DB.First(&milestone, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "milestone not found",
		})
	}

	milestone.Status = "submitted"

	config.DB.Save(&milestone)

	return c.JSON(fiber.Map{
		"message": "milestone submitted",
	})
}

func ApproveMilestone(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid milestone id",
		})
	}

	var milestone models.Milestone

	if err := config.DB.First(&milestone, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "milestone not found",
		})
	}

	milestone.Status = "approved"

	config.DB.Save(&milestone)

	return c.JSON(fiber.Map{
		"message": "milestone approved",
	})
}