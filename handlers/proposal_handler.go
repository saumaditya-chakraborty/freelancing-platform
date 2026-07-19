package handlers

import (
	"fmt"
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

func CreateProposal(c *fiber.Ctx) error {

	var proposal models.Proposal

	freelancerID, _ := c.Locals("userID").(uint)

	if err := c.BodyParser(&proposal); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	

	// prevent duplicate bids
	var existing models.Proposal

	err := config.DB.
		Where(
			"project_id = ? AND freelancer_id = ?",
			proposal.ProjectID,
			freelancerID,
		).
		First(&existing).Error

	if err == nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "you already submitted a proposal",
		})
	}

	proposal.FreelancerID = freelancerID
	proposal.Status = "pending"

	if err := config.DB.Create(&proposal).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to create proposal",
		})
	}

	config.DB.
	Model(&models.Project{}).
	Where("id = ?", proposal.ProjectID).
	Update("status", "reviewing_proposals")

	// DEBUG RESPONSE
	return c.Status(201).JSON(fiber.Map{
		"DEBUG":    "NEW_HANDLER",
		"proposal": proposal,
	})
}

func GetProposals(c *fiber.Ctx) error {

	var proposals []models.Proposal

	if err := config.DB.
	Preload("Project").
	Find(&proposals).Error; err != nil {
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

	freelancerID, _ := c.Locals("userID").(uint)

	if err := config.DB.First(&proposal, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	if proposal.FreelancerID != freelancerID {
		return c.Status(403).JSON(fiber.Map{
			"error": "not your proposal",
		})
	}

	proposal.BidAmount = updatedProposal.BidAmount
	proposal.CoverLetter = updatedProposal.CoverLetter
	proposal.DeliveryDays = updatedProposal.DeliveryDays

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

	freelancerID, _ := c.Locals("userID").(uint)

	if err := config.DB.First(&proposal, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	if proposal.FreelancerID != freelancerID {
		return c.Status(403).JSON(fiber.Map{
			"error": "not your proposal",
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

func AcceptProposal(c *fiber.Ctx) error {

	proposalID, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	clientID, _ := c.Locals("userID").(uint)

	var proposal models.Proposal

	if err := config.DB.First(&proposal, proposalID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	var project models.Project

	if err := config.DB.First(&project, proposal.ProjectID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "project not found",
		})
	}

	if project.ClientID != clientID {
		return c.Status(403).JSON(fiber.Map{
			"error": "not your project",
		})
	}

	tx := config.DB.Begin()

	proposal.Status = "accepted"

	if err := tx.Save(&proposal).Error; err != nil {
		tx.Rollback()

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to accept proposal",
		})
	}

	if err := tx.Model(&models.Proposal{}).
		Where(
			"project_id = ? AND id != ?",
			proposal.ProjectID,
			proposal.ID,
		).
		Update("status", "rejected").Error; err != nil {

		tx.Rollback()

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to reject other proposals",
		})
	}

	if err := tx.Model(&models.Project{}).
		Where("id = ?", project.ID).
		Update("status", "assigned").Error; err != nil {

		tx.Rollback()

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to update project",
		})
	}

	var client models.User

if err := tx.First(&client, project.ClientID).Error; err != nil {

	tx.Rollback()

	return c.Status(500).JSON(fiber.Map{
		"error": "client not found",
	})
    
}

     fmt.Println("========== NEW NOTIFICATION ==========")
fmt.Println("Project:", project.Title)
fmt.Println("Client:", client.Name)
	  notification := models.Notification{
	UserID: proposal.FreelancerID,

	Title: "Project Assigned Successfully",

	Message: fmt.Sprintf(
		"Your proposal for \"%s\" has been accepted. You have been assigned this project. Please get in touch with %s for further project details, milestones, and timeline.",
		project.Title,
		client.Name,
	),

	IsRead: false,
}

if err := tx.Create(&notification).Error; err != nil {

    tx.Rollback()

    return c.Status(500).JSON(fiber.Map{
        "error": "failed to create notification",
    })

}

	tx.Commit()

	return c.JSON(fiber.Map{
		"message": "proposal accepted successfully",
	})
}

func GetProjectProposals(c *fiber.Ctx) error {

	projectID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid project id",
		})
	}

	var proposals []models.Proposal

	if err := config.DB.
		Preload("Project").
		Preload("Freelancer").
		Where("project_id = ?", projectID).
		Find(&proposals).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch proposals",
		})
	}

	return c.JSON(proposals)
}