package main

import (
	"freelancing-platform/config"
	"freelancing-platform/models"
	"freelancing-platform/routes"

	"github.com/gofiber/fiber/v2"
)

func main() {

	// Connect to PostgreSQL
	config.ConnectDB()

	// Auto Migrate Tables
	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Project{},
		&models.Proposal{},
	)

	if err != nil {
		panic(err)
	}

	app := fiber.New()

	// Routes
	routes.SetupUserRoutes(app)
	routes.SetupProjectRoutes(app)
	routes.SetupProposalRoutes(app)
	routes.SetupAuthRoutes(app)

	// Start Server
	if err := app.Listen(":3000"); err != nil {
		panic(err)
	}
}