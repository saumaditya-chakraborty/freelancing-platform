package handlers

import (
	"freelancing-platform/config"
	"freelancing-platform/models"
	"freelancing-platform/services"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// GET WALLET (BALANCE + ESCROW)
func GetWallet(c *fiber.Ctx) error {

	userID, _ := c.Locals("userID").(uint)

	wallet, err := services.GetOrCreateWallet(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch wallet",
		})
	}

	return c.JSON(wallet)
}

// ADD MONEY TO WALLET (TOP-UP)
type AddMoneyRequest struct {
	Amount int `json:"amount"`
}

func AddMoney(c *fiber.Ctx) error {

	userID, _ := c.Locals("userID").(uint)

	var req AddMoneyRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	if req.Amount <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "invalid amount"})
	}

	wallet, err := services.GetOrCreateWallet(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to fetch wallet"})
	}

	wallet.Balance += req.Amount

	if err := config.DB.Save(&wallet).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to add money"})
	}

	config.DB.Create(&models.Transaction{
		UserID:    userID,
		Type:      "credit",
		Amount:    req.Amount,
		Reference: "wallet_topup_" + strconv.Itoa(int(userID)),
	})

	return c.JSON(wallet)
}

// WITHDRAW MONEY
type WithdrawRequest struct {
	Amount int `json:"amount"`
}

func WithdrawMoney(c *fiber.Ctx) error {

	userID, _ := c.Locals("userID").(uint)

	var req WithdrawRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid request"})
	}

	if req.Amount <= 0 {
		return c.Status(400).JSON(fiber.Map{"error": "invalid amount"})
	}

	wallet, err := services.GetOrCreateWallet(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to fetch wallet"})
	}

	if wallet.Balance < req.Amount {
		return c.Status(400).JSON(fiber.Map{"error": "insufficient balance"})
	}

	wallet.Balance -= req.Amount

	if err := config.DB.Save(&wallet).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "withdraw failed"})
	}

	config.DB.Create(&models.Transaction{
		UserID:    userID,
		Type:      "debit",
		Amount:    req.Amount,
		Reference: "withdraw_" + strconv.Itoa(int(userID)),
	})

	return c.JSON(wallet)
}

// TRANSACTION HISTORY
func GetTransactions(c *fiber.Ctx) error {

	userID, _ := c.Locals("userID").(uint)

	var transactions []models.Transaction

	if err := config.DB.Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&transactions).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "failed to fetch transactions",
		})
	}

	return c.JSON(transactions)
}
