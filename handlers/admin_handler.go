package handlers

import (
	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

type DashboardStats struct {
	TotalUsers        int64 `json:"total_users"`
	TotalClients      int64 `json:"total_clients"`
	TotalFreelancers  int64 `json:"total_freelancers"`
	TotalProjects     int64 `json:"total_projects"`
	TotalProposals    int64 `json:"total_proposals"`
	TotalPayments     int64 `json:"total_payments"`
	TotalReviews      int64 `json:"total_reviews"`
	BlockedUsers      int64 `json:"blocked_users"`
	BannedUsers       int64 `json:"banned_users"`
}

func AdminDashboard(c *fiber.Ctx) error {

	var stats DashboardStats

	config.DB.Model(&models.User{}).Count(&stats.TotalUsers)
	config.DB.Model(&models.User{}).Where("role = ?", "client").Count(&stats.TotalClients)
	config.DB.Model(&models.User{}).Where("role = ?", "freelancer").Count(&stats.TotalFreelancers)

	config.DB.Model(&models.Project{}).Count(&stats.TotalProjects)
	config.DB.Model(&models.Proposal{}).Count(&stats.TotalProposals)
	config.DB.Model(&models.Payment{}).Count(&stats.TotalPayments)
	config.DB.Model(&models.Review{}).Count(&stats.TotalReviews)

	config.DB.Model(&models.User{}).Where("is_blocked = ?", true).Count(&stats.BlockedUsers)
	config.DB.Model(&models.User{}).Where("is_banned = ?", true).Count(&stats.BannedUsers)

	return c.JSON(stats)
}

func AdminGetUsers(c *fiber.Ctx) error {

	var users []models.User

	if err := config.DB.Find(&users).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(users)
}

func AdminGetUser(c *fiber.Ctx) error {

	id := c.Params("id")

	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	return c.JSON(user)
}

// ==========================================
// BLOCK USER
// ==========================================

func AdminBlockUser(c *fiber.Ctx) error {

	id := c.Params("id")

	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	if user.Role == "admin" {
		return c.Status(403).JSON(fiber.Map{
			"error": "Admin accounts cannot be blocked",
		})
	}

	user.IsBlocked = true

	if err := config.DB.Save(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "User blocked successfully",
	})
}

// ==========================================
// UNBLOCK USER
// ==========================================

func AdminUnblockUser(c *fiber.Ctx) error {

	id := c.Params("id")

	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	user.IsBlocked = false

	if err := config.DB.Save(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "User unblocked successfully",
	})
}

// ==========================================
// BAN USER
// ==========================================

func AdminBanUser(c *fiber.Ctx) error {

	id := c.Params("id")

	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	if user.Role == "admin" {
		return c.Status(403).JSON(fiber.Map{
			"error": "Admin accounts cannot be banned",
		})
	}

	user.IsBanned = true
	user.IsBlocked = true

	if err := config.DB.Save(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "User banned successfully",
	})
}

// ==========================================
// GET PROJECTS
// ==========================================

func AdminGetProjects(c *fiber.Ctx) error {

	var projects []models.Project

	if err := config.DB.Find(&projects).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(projects)
}

// ==========================================
// DELETE PROJECT
// ==========================================

func AdminDeleteProject(c *fiber.Ctx) error {

	id := c.Params("id")

	if err := config.DB.Delete(&models.Project{}, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Project deleted successfully",
	})
}

// ==========================================
// GET PROPOSALS
// ==========================================

func AdminGetProposals(c *fiber.Ctx) error {

	var proposals []models.Proposal

	if err := config.DB.Find(&proposals).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(proposals)
}

// ==========================================
// DELETE PROPOSAL
// ==========================================

func AdminDeleteProposal(c *fiber.Ctx) error {

	id := c.Params("id")

	if err := config.DB.Delete(&models.Proposal{}, id).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Proposal deleted successfully",
	})
}