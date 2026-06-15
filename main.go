package main

import (
	"log"

	"freelancing-platform/config"
	"freelancing-platform/models"
	"freelancing-platform/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// 1. Connect to PostgreSQL
	config.ConnectDB()

	// 2. Auto Migrate Tables safely using GORM structures
	log.Println("Syncing schemas with PostgreSQL...")
	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Project{},
		&models.Proposal{},
		&models.Milestone{},
		&models.Review{},
		&models.Dispute{},
	)
	if err != nil {
		log.Fatalf("Critical Error: Schema auto-migration failed: %v", err)
	}

	// 3. Initialize Fiber App Engine
	app := fiber.New()

	// Global Middleware Integration
	app.Use(logger.New()) 

	// 4. Routes — Passing 'app' directly to keep your original route files intact!
	routes.SetupUserRoutes(app)
	routes.SetupProjectRoutes(app)
	routes.SetupProposalRoutes(app)
	routes.SetupAuthRoutes(app)
	routes.SetupMarketplaceRoutes(app) // Updated this to accept 'app' too!

	// 5. Launch Server Engine Listener
	log.Println("Backend engine successfully listening on port 3000...")
	if err := app.Listen(":3000"); err != nil {
		log.Fatalf("Critical Error: Server failed to start: %v", err)
	}
}