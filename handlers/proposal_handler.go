package handlers

import (
	"strconv"

	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

var Proposals []models.Proposal

func CreateProposal(c *fiber.Ctx) error {
	var proposal models.Proposal

	if err := c.BodyParser(&proposal); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	Proposals = append(Proposals, proposal)

	return c.Status(201).JSON(proposal)
}

func GetProposals(c *fiber.Ctx) error {
	return c.JSON(Proposals)
}

func GetProposalByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	for _, proposal := range Proposals {
		if proposal.ID == id {
			return c.JSON(proposal)
		}
	}

	return c.Status(404).JSON(fiber.Map{
		"error": "proposal not found",
	})
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

	for i, proposal := range Proposals {
		if proposal.ID == id {
			Proposals[i] = updatedProposal
			return c.JSON(updatedProposal)
		}
	}

	return c.Status(404).JSON(fiber.Map{
		"error": "proposal not found",
	})
}

func DeleteProposal(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	for i, proposal := range Proposals {
		if proposal.ID == id {
			Proposals = append(Proposals[:i], Proposals[i+1:]...)

			return c.JSON(fiber.Map{
				"message": "proposal deleted",
			})
		}
	}

	return c.Status(404).JSON(fiber.Map{
		"error": "proposal not found",
	})
}