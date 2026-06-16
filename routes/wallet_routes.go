package routes

import (
	"freelancing-platform/handlers"
	"freelancing-platform/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupWalletRoutes(app *fiber.App) {

	wallet := app.Group("/wallet", middleware.Protected())

	wallet.Get("/", handlers.GetWallet)
	wallet.Post("/add", handlers.AddMoney)
	wallet.Post("/withdraw", handlers.WithdrawMoney)
	wallet.Get("/transactions", handlers.GetTransactions)
}