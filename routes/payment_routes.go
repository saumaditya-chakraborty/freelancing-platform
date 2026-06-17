package routes

import (
	"freelancing-platform/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupPaymentRoutes(app *fiber.App) {

	app.Put(
		"/milestones/:id/pay",
		handlers.ReleasePayment,
	)

	app.Get(
		"/payments",
		handlers.GetPayments,
	)
}