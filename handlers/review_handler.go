package handlers

import (
	"math"
	"strconv"

	"freelancing-platform/config"
	"freelancing-platform/models"

	"github.com/gofiber/fiber/v2"
)

type ReviewRequest struct {
	Rating  int    `json:"rating"`
	Comment string `json:"comment"`
}

func CreateReview(c *fiber.Ctx) error {

	projectID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid project id",
		})
	}

	clientID, _ := c.Locals("userID").(uint)

	var body ReviewRequest

	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	if body.Rating < 1 || body.Rating > 5 {
		return c.Status(400).JSON(fiber.Map{
			"error": "rating must be between 1 and 5",
		})
	}

	//-------------------------------------
	// Find Project
	//-------------------------------------

	var project models.Project

	if err := config.DB.
		First(&project, projectID).Error; err != nil {

		return c.Status(404).JSON(fiber.Map{
			"error": "project not found",
		})
	}

	if project.ClientID != clientID {

		return c.Status(403).JSON(fiber.Map{
			"error": "this is not your project",
		})
	}

	//-------------------------------------
	// Only completed projects
	//-------------------------------------

	if project.Status != "completed" {

		return c.Status(400).JSON(fiber.Map{
			"error": "project is not completed yet",
		})
	}

	//-------------------------------------
	// Find accepted proposal
	//-------------------------------------

	var proposal models.Proposal

	if err := config.DB.
		Where("project_id = ?", project.ID).
		First(&proposal).Error; err != nil {

		return c.Status(404).JSON(fiber.Map{
			"error": "proposal not found",
		})
	}

	//-------------------------------------
	// Prevent duplicate review
	//-------------------------------------

	var existing models.Review

	err = config.DB.
		Where(
			"project_id = ?",
			project.ID,
		).
		First(&existing).Error

	if err == nil {

		return c.Status(400).JSON(fiber.Map{
			"error": "review already submitted",
		})
	}

	//-------------------------------------
	// Create Review
	//-------------------------------------

	review := models.Review{

		ProjectID: project.ID,

		ClientID: clientID,

		FreelancerID: proposal.FreelancerID,

		Rating: body.Rating,

		Comment: body.Comment,
	}

	if err := config.DB.Create(&review).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to create review",
		})
	}

	//-------------------------------------
	// Update Freelancer Rating
	//-------------------------------------

	if err := updateFreelancerRating(
		proposal.FreelancerID,
	); err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "review saved but rating update failed",
		})
	}

	return c.Status(201).JSON(fiber.Map{

		"message": "review submitted successfully",

		"review": review,
	})
}
func updateFreelancerRating(freelancerID uint) error {

	var reviews []models.Review

	if err := config.DB.
		Where(
			"freelancer_id = ?",
			freelancerID,
		).
		Find(&reviews).Error; err != nil {

		return err
	}

	total := 0

	for _, r := range reviews {

		total += r.Rating
	}

	average := 0.0

	if len(reviews) > 0 {

		average = float64(total) /
			float64(len(reviews))

		average = math.Round(
			average*10,
		) / 10
	}

	return config.DB.
		Model(&models.User{}).
		Where(
			"id = ?",
			freelancerID,
		).
		Updates(map[string]interface{}{
			"average_rating": average,
			"total_reviews":  len(reviews),
		}).Error
}

func GetFreelancerReviews(c *fiber.Ctx) error {

	freelancerID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "invalid freelancer id",
		})
	}

	var reviews []models.Review

	if err := config.DB.
		Preload("Client").
		Preload("Project").
		Where("freelancer_id = ?", freelancerID).
		Order("created_at DESC").
		Find(&reviews).Error; err != nil {

		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch reviews",
		})
	}

	type ReviewResponse struct {
		ID          uint   `json:"id"`
		ProjectID   uint   `json:"project_id"`
		ProjectName string `json:"project_name"`
		ClientName  string `json:"client_name"`
		Rating      int    `json:"rating"`
		Comment     string `json:"comment"`
		CreatedAt   string `json:"created_at"`
	}

	response := []ReviewResponse{}

	for _, review := range reviews {

		response = append(response, ReviewResponse{
			ID:          review.ID,
			ProjectID:   review.ProjectID,
			ProjectName: review.Project.Title,
			ClientName:  review.Client.Name,
			Rating:      review.Rating,
			Comment:     review.Comment,
			CreatedAt:   review.CreatedAt.Format("02 Jan 2006"),
		})
	}

	return c.JSON(response)
}

func GetFreelancerRating(c *fiber.Ctx) error {

	freelancerID, err := strconv.Atoi(c.Params("id"))
	if err != nil {

		return c.Status(400).JSON(fiber.Map{
			"error": "invalid freelancer id",
		})
	}

	var user models.User

	if err := config.DB.
		First(&user, freelancerID).Error; err != nil {

		return c.Status(404).JSON(fiber.Map{
			"error": "freelancer not found",
		})
	}

	return c.JSON(fiber.Map{

		"average_rating": user.AverageRating,

		"total_reviews": user.TotalReviews,

		"rounded_rating": math.Round(user.AverageRating),
	})
}
