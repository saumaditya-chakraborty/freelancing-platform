package routes

import (
	"freelancing-platform/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupMilestoneRoutes(app *fiber.App) {

	app.Post(
		"/projects/:projectId/milestones",
		handlers.CreateMilestone,
	)

	app.Get(
		"/projects/:projectId/milestones",
		handlers.GetMilestones,
	)

	app.Put(
		"/milestones/:id/submit",
		handlers.SubmitMilestone,
	)

	app.Put(
		"/milestones/:id/approve",
		handlers.ApproveMilestone,
	)
}