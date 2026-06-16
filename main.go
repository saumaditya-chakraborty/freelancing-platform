package main

import (
	"log"
	"os"

	"freelancing-platform/config"
	"freelancing-platform/models"
	"freelancing-platform/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {

	// 1. Connect to PostgreSQL
	config.ConnectDB()

	// 2. Auto migrate all schemas (INCLUDING PHASE 1 WALLET SYSTEM)
	log.Println("Syncing schemas with PostgreSQL...")

	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Project{},
		&models.Proposal{},
		&models.Milestone{},
		&models.Review{},
		&models.Dispute{},

		// ✅ PHASE 1 ADDITIONS
		&models.Wallet{},
		&models.Transaction{},
	)

	if err != nil {
		log.Fatalf("Critical Error: Schema auto-migration failed: %v", err)
	}

	log.Println("All schemas synced successfully")

	// 3. Initialize Fiber App
	app := fiber.New()

	// Global Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
	}))

	// 4. Routes
	routes.SetupUserRoutes(app)
	routes.SetupProjectRoutes(app)
	routes.SetupProposalRoutes(app)
	routes.SetupAuthRoutes(app)
	routes.SetupMarketplaceRoutes(app)
	routes.SetupWalletRoutes(app)

	// 5. Health Check (optional but good practice)
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "freelancing-platform-backend",
		})
	})

	// 6. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Backend engine running on http://localhost:%s", port)

	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Critical Error: Server failed to start: %v", err)
	}
}
