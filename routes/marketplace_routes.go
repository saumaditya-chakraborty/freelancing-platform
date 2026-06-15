package routes

import (
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupMarketplaceRoutes handles mounting milestones, reviews, and dispute pipelines
func SetupMarketplaceRoutes(router fiber.Router) {
	
	// -------------------------------------------------------------
	// MILESTONE ROUTING LAYERS
	// -------------------------------------------------------------
	// Clients can build financial milestone goals for an active project
	router.Post("/projects/:projectId/milestones", 
		middleware.Protected(), 
		middleware.RequireRole("client"), 
		handlers.CreateMilestone,
	)
	// Freelancers submit their complete deliverables for a milestone
	router.Patch("/milestones/:milestoneId/submit", 
		middleware.Protected(), 
		middleware.RequireRole("freelancer"), 
		handlers.SubmitMilestone,
	)
	// Clients release milestone escrow payments to the freelancer
	router.Patch("/milestones/:milestoneId/release", 
		middleware.Protected(), 
		middleware.RequireRole("client"), 
		handlers.ReleaseMilestoneFunds,
	)

	// -------------------------------------------------------------
	// REVIEW & RATING ROUTING LAYERS
	// -------------------------------------------------------------
	// Clients and freelancers submit completed marketplace experience ratings
	router.Post("/reviews", 
		middleware.Protected(), 
		handlers.LeaveReview,
	)

	// -------------------------------------------------------------
	// ARBITRATION DISPUTE ROUTING LAYERS
	// -------------------------------------------------------------
	// Counterparties file a dispute ticket to pause a broken contract
	router.Post("/disputes", 
		middleware.Protected(), 
		handlers.FileDispute,
	)
	// Admins resolve open conflict tickets
	router.Patch("/disputes/:disputeId/resolve", 
		middleware.Protected(), 
		middleware.RequireRole("admin"), 
		handlers.ResolveDispute,
	)
}