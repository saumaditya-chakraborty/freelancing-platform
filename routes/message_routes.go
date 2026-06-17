package routes

import (
	"freelancing-platform/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func MessageRoutes(app *fiber.App) {

	app.Get("/ws/:userId", websocket.New(
		handlers.Chat,
	))
}