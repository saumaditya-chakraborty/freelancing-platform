package routes

import (
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupProposalRoutes(app *fiber.App) {

	app.Get("/proposals", handlers.GetProposals)

	app.Get("/proposals/:id", handlers.GetProposalByID)

	app.Post(
	"/proposals",
	middleware.Protected(),
	middleware.RequireRole("freelancer"),
	handlers.CreateProposal,
)
  // use middleware
	app.Put("/proposals/:id", handlers.UpdateProposal)
  // protect 
	app.Delete("/proposals/:id", handlers.DeleteProposal)
}