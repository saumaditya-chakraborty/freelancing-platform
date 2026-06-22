package routes

import (
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupProposalRoutes(app *fiber.App) {

	app.Get("/proposals",middleware.Protected(), handlers.GetProposals)

	app.Get("/proposals/:id",middleware.Protected(), handlers.GetProposalByID)

	app.Post(
		"/proposals",
		middleware.Protected(),
		middleware.RequireRole("freelancer"),
		handlers.CreateProposal,
	)
	app.Patch("/proposals/:id/accept", middleware.Protected(), middleware.RequireRole("client"), handlers.AcceptProposal)
	app.Put("/proposals/:id", middleware.Protected(), middleware.RequireRole("freelancer"), handlers.UpdateProposal)
	app.Delete("/proposals/:id", middleware.Protected(), middleware.RequireRole("freelancer"), handlers.DeleteProposal)
}
