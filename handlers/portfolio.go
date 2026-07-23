package handlers

import (
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

// Create Portfolio
func CreatePortfolio(c *fiber.Ctx) error {

	var portfolio models.Portfolio

	freelancerID, _ := c.Locals("userID").(uint)

	if err := c.BodyParser(&portfolio); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	portfolio.FreelancerID = freelancerID

	if err := config.DB.Create(&portfolio).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to create portfolio",
		})
	}

	return c.Status(201).JSON(portfolio)
}

// Get My Portfolio
func GetMyPortfolio(c *fiber.Ctx) error {

	freelancerID, _ := c.Locals("userID").(uint)

	var portfolios []models.Portfolio

	if err := config.DB.
		Where("freelancer_id = ?", freelancerID).
		Find(&portfolios).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch portfolio",
		})
	}

	return c.JSON(portfolios)
}

// Update Portfolio
func UpdatePortfolio(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	freelancerID, _ := c.Locals("userID").(uint)

	var portfolio models.Portfolio

	if err := config.DB.First(&portfolio, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "portfolio not found",
		})
	}

	if portfolio.FreelancerID != freelancerID {
		return c.Status(403).JSON(fiber.Map{
			"error": "not your portfolio",
		})
	}

	var updated models.Portfolio

	if err := c.BodyParser(&updated); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	portfolio.Title = updated.Title
	portfolio.Description = updated.Description
	portfolio.GithubURL = updated.GithubURL
	portfolio.DemoURL = updated.DemoURL
	portfolio.ImageURL = updated.ImageURL
	portfolio.Technologies = updated.Technologies

	if err := config.DB.Save(&portfolio).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to update portfolio",
		})
	}

	return c.JSON(portfolio)
}

// Delete Portfolio
func DeletePortfolio(c *fiber.Ctx) error {

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	freelancerID, _ := c.Locals("userID").(uint)

	var portfolio models.Portfolio

	if err := config.DB.First(&portfolio, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "portfolio not found",
		})
	}

	if portfolio.FreelancerID != freelancerID {
		return c.Status(403).JSON(fiber.Map{
			"error": "not your portfolio",
		})
	}

	if err := config.DB.Delete(&portfolio).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to delete portfolio",
		})
	}

	return c.JSON(fiber.Map{
		"message": "portfolio deleted successfully",
	})
}