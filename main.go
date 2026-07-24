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
		&models.Message{},
		&models.Milestone{},
		&models.Notification{},
		&models.Payment{},
		&models.Review{},
		&models.Message{},
		&models.Conversation{},
		&models.Review{},
		&models.Portfolio{},
		&models.TimeTracking{},
        &models.TimeLog{}, 
	


	)

	

	if err != nil {
		log.Fatalf("Critical Error: Schema auto-migration failed: %v", err)
	}

	config.SeedAdmin()

	log.Println("All schemas synced successfully")

	
	app := fiber.New()


	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
	}))


	routes.SetupUserRoutes(app)
	routes.SetupProjectRoutes(app)
	routes.SetupProposalRoutes(app)
	routes.SetupAuthRoutes(app)
	routes.MessageRoutes(app)
	routes.SetupMilestoneRoutes(app)
	routes.SetupPaymentRoutes(app)
	routes.ReviewRoutes(app)
	routes.SetupAdminRoutes(app)
	routes.NotificationRoutes(app)
	routes.PortfolioRoutes(app)
	routes.SetupTimeTrackingRoutes(app)


	
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "freelancing-platform-backend",
		})
	})

	
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Backend engine running on http://localhost:%s", port)

	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Critical Error: Server failed to start: %v", err)
	}
}
