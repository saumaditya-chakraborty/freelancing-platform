package handlers

import (
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

func CreateProposal(c *fiber.Ctx) error {

	var proposal models.Proposal

	if err := c.BodyParser(&proposal); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	if err := config.DB.Create(&proposal).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to create proposal",
		})
	}

	return c.Status(201).JSON(proposal)
}

func GetProposals(c *fiber.Ctx) error {

	var proposals []models.Proposal

	if err := config.DB.Find(&proposals).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch proposals",
		})
	}

	return c.JSON(proposals)
}

func GetProposalByID(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	var proposal models.Proposal

	if err := config.DB.First(&proposal, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	return c.JSON(proposal)
}

func UpdateProposal(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	var updatedProposal models.Proposal

	if err := c.BodyParser(&updatedProposal); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	var proposal models.Proposal

	if err := config.DB.First(&proposal, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	proposal.ProjectID = updatedProposal.ProjectID
	proposal.FreelancerID = updatedProposal.FreelancerID
	proposal.Message = updatedProposal.Message
	proposal.BidAmount = updatedProposal.BidAmount

	if err := config.DB.Save(&proposal).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to update proposal",
		})
	}

	return c.JSON(proposal)
}

func DeleteProposal(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	var proposal models.Proposal

	if err := config.DB.First(&proposal, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	if err := config.DB.Delete(&proposal).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to delete proposal",
		})
	}

	return c.JSON(fiber.Map{
		"message": "proposal deleted",
	})
}