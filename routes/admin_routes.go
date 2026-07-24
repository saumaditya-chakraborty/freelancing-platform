package routes

import (
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupAdminRoutes(app *fiber.App) {

	admin := app.Group("/admin")

	// Authentication
	admin.Use(middleware.Protected())
	admin.Use(middleware.RequireRole("admin"))

	// ================= Dashboard =================
	admin.Get("/dashboard", handlers.AdminDashboard)

	// ================= Users =================
	admin.Get("/users", handlers.AdminGetUsers)

	admin.Get("/users/:id", handlers.AdminGetUser)

	admin.Patch("/users/:id/block", handlers.AdminBlockUser)

	admin.Patch("/users/:id/unblock", handlers.AdminUnblockUser)

	admin.Patch("/users/:id/ban", handlers.AdminBanUser)

	// ================= Projects =================
	admin.Get("/projects", handlers.AdminGetProjects)

	admin.Delete("/projects/:id", handlers.AdminDeleteProject)

	// ================= Proposals =================
	admin.Get("/proposals", handlers.AdminGetProposals)

	admin.Delete("/proposals/:id", handlers.AdminDeleteProposal)

	
}