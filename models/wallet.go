package models

import "time"

type Wallet struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"uniqueIndex"`
	Balance   int       `json:"balance" gorm:"default:0"`     // available money
	Escrow    int       `json:"escrow" gorm:"default:0"`      // locked money
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}