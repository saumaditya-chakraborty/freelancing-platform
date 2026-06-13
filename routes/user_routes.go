package routes

import (
	"freelancing-platform/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupUserRoutes(app *fiber.App) {

	app.Get("/users", handlers.GetUsers)

	app.Get("/users/:id", handlers.GetUserByID)

	app.Post("/users", handlers.CreateUser)

	app.Put("/users/:id", handlers.UpdateUser)

	app.Delete("/users/:id", handlers.DeleteUser)
}