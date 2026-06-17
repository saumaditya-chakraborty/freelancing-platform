package routes

import (
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupAdminRoutes(app *fiber.App) {

	admin := app.Group("/admin")

	admin.Use(middleware.Protected())
	admin.Use(middleware.RequireRole("admin"))

	admin.Get("/users", handlers.AdminGetUsers)

	admin.Delete("/users/:id", handlers.AdminDeleteUser)

	admin.Get("/projects", handlers.AdminGetProjects)

	admin.Delete("/projects/:id", handlers.AdminDeleteProject)

	admin.Get("/payments", handlers.AdminGetPayments)

	admin.Get("/reviews", handlers.AdminGetReviews)
}