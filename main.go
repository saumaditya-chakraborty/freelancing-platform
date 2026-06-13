package main

import (
	"freelancing-platform/routes"
	

	"github.com/gofiber/fiber/v2"
)

func main() {

	app := fiber.New()

	routes.SetupUserRoutes(app)
	routes.SetupProjectRoutes(app)
	routes.SetupProposalRoutes(app)
	routes.SetupAuthRoutes(app)

	if err := app.Listen(":3000"); err != nil {
		panic(err)
	}
}