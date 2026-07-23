package routes

import (
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"

	"github.com/gofiber/fiber/v2"
)

func PortfolioRoutes(app *fiber.App) {

	portfolio := app.Group("/api/portfolio")

	portfolio.Use(middleware.Protected())

	portfolio.Post("/", handlers.CreatePortfolio)
	portfolio.Get("/", handlers.GetMyPortfolio)
	portfolio.Put("/:id", handlers.UpdatePortfolio)
	portfolio.Delete("/:id", handlers.DeletePortfolio)
}