package routes

import (
	"freelancing-platform/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupReviewRoutes(app *fiber.App) {

	app.Post(
		"/reviews",
		handlers.LeaveReview,
	)

	app.Get(
		"/reviews/:userId",
		handlers.GetReviews,
	)
}