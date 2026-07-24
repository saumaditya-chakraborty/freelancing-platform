package config

import (
	"log"

	"freelancing-platform/models"
	"freelancing-platform/utils"
)

func SeedAdmin() {

	var admin models.User

	err := DB.Where("email = ?", "admin@freelancex.com").First(&admin).Error

	// Admin already exists
	if err == nil {
		log.Println("Admin account already exists.")
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword("Admin@123")

	if err != nil {
		log.Println("Failed to hash admin password")
		return
	}

	admin = models.User{
		Name:           "System Administrator",
		Email:          "admin@freelancex.com",
		Password:       hashedPassword,
		Role:           "admin",
		IsBlocked:      false,
		IsBanned:       false,
		AverageRating:  0,
		TotalReviews:   0,
	}

	if err := DB.Create(&admin).Error; err != nil {
		log.Println("Failed to create admin:", err)
		return
	}

	log.Println("Default admin account created successfully.")
}