package services

import (
	"freelancing-platform/config"
	"freelancing-platform/models"
)

func GetOrCreateWallet(userID uint) (models.Wallet, error) {
	var wallet models.Wallet

	err := config.DB.Where("user_id = ?", userID).First(&wallet).Error
	if err == nil {
		return wallet, nil
	}

	wallet = models.Wallet{
		UserID: userID,
		Balance: 0,
		Escrow:  0,
	}

	err = config.DB.Create(&wallet).Error
	return wallet, err
}