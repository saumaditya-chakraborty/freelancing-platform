package routes

import (
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupTimeTrackingRoutes(app *fiber.App) {

	// ==========================================
	// Time Tracking Routes
	// ==========================================

	// Start Timer
	app.Post(
		"/projects/:id/time/start",
		middleware.Protected(),
		middleware.RequireRole("freelancer"),
		handlers.StartTimer,
	)

	// Pause Timer
	app.Patch(
		"/time/:id/pause",
		middleware.Protected(),
		middleware.RequireRole("freelancer"),
		handlers.PauseTimer,
	)

	// Resume Timer
	app.Patch(
		"/time/:id/resume",
		middleware.Protected(),
		middleware.RequireRole("freelancer"),
		handlers.ResumeTimer,
	)

	// Stop Timer
	app.Patch(
		"/time/:id/stop",
		middleware.Protected(),
		middleware.RequireRole("freelancer"),
		handlers.StopTimer,
	)

	// Get Total Time for a Project
	app.Get(
		"/projects/:id/time",
		middleware.Protected(),
		handlers.GetProjectTime,
	)

	// Get Time Logs
	app.Get(
		"/projects/:id/time/logs",
		middleware.Protected(),
		handlers.GetTimeLogs,
	)
}