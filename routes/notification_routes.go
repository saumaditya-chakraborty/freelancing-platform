package routes

import (
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"

	"github.com/gofiber/fiber/v2"
)

func NotificationRoutes(app fiber.Router) {

	notifications := app.Group("/notifications")

	notifications.Use(middleware.Protected())

	notifications.Get("/", handlers.GetNotifications)

	notifications.Patch("/:id/read", handlers.MarkNotificationRead)
}