package routes

import (
	"freelancing-platform/handlers"
    "freelancing-platform/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupProjectRoutes(app *fiber.App) {

	app.Get("/projects", handlers.GetProjects)

	app.Get("/projects/:id", handlers.GetProjectByID)

	app.Post(
	"/projects",
	middleware.Protected(),
	middleware.RequireRole("client"),
	handlers.CreateProject,
)
   // use some middleware 
	app.Put("/projects/:id", handlers.UpdateProject)
   // use protector
	app.Delete("/projects/:id", handlers.DeleteProject)
}