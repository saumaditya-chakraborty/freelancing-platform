package services

import (
	"fmt"
	"freelancing-platform/config"
	"freelancing-platform/models"

	"gorm.io/gorm"
)

func HoldInEscrow(userID uint, amount int, reference string) error {

	var wallet models.Wallet
	if err := config.DB.Where("user_id = ?", userID).First(&wallet).Error; err != nil {
		return err
	}

	if wallet.Balance < amount {
		return fmt.Errorf("insufficient balance")
	}

	wallet.Balance -= amount
	wallet.Escrow += amount

	if err := config.DB.Save(&wallet).Error; err != nil {
		return err
	}

	tx := models.Transaction{
		UserID:    userID,
		Type:      "escrow_hold",
		Amount:    amount,
		Reference: reference,
	}

	return config.DB.Create(&tx).Error
}

func ReleaseEscrow(clientID uint, freelancerID uint, amount int, reference string) error {

	return config.DB.Transaction(func(txdb *gorm.DB) error {
		var clientWallet models.Wallet
		if err := txdb.Where("user_id = ?", clientID).First(&clientWallet).Error; err != nil {
			return err
		}
		if clientWallet.Escrow < amount {
			return fmt.Errorf("insufficient escrow")
		}

		var freelancerWallet models.Wallet
		if err := txdb.Where("user_id = ?", freelancerID).First(&freelancerWallet).Error; err != nil {
			freelancerWallet = models.Wallet{UserID: freelancerID}
			if err := txdb.Create(&freelancerWallet).Error; err != nil {
				return err
			}
		}

		clientWallet.Escrow -= amount
		freelancerWallet.Balance += amount

		if err := txdb.Save(&clientWallet).Error; err != nil {
			return err
		}
		if err := txdb.Save(&freelancerWallet).Error; err != nil {
			return err
		}

		if err := txdb.Create(&models.Transaction{
			UserID:    clientID,
			Type:      "escrow_release",
			Amount:    amount,
			Reference: reference,
		}).Error; err != nil {
			return err
		}

		return txdb.Create(&models.Transaction{
			UserID:    freelancerID,
			Type:      "credit",
			Amount:    amount,
			Reference: reference,
		}).Error
	})
}
