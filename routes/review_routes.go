package routes

import (
	   "log"
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"

	"github.com/gofiber/fiber/v2"
)

func ReviewRoutes(app *fiber.App) {
	 log.Println("Review routes registered")

	reviews := app.Group(
		"/reviews",
		middleware.Protected(),
	)

	// POST /reviews/project/15
	reviews.Post(
		"/project/:id",
		middleware.RequireRole("client"),
		handlers.CreateReview,
	)

	// GET /reviews/freelancer/8
	reviews.Get(
		"/freelancer/:id",
		handlers.GetFreelancerReviews,
	)

	// GET /reviews/freelancer/8/rating
	reviews.Get(
		"/freelancer/:id/rating",
		handlers.GetFreelancerRating,
	)
}