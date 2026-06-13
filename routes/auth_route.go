package routes

import (
	"freelancing-platform/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupAuthRoutes(app *fiber.App) {

	app.Post("/login", handlers.Login)
}