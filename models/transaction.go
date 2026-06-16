package models

import "time"

type Transaction struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	Type      string    `json:"type"` // credit / debit / escrow_hold / escrow_release
	Amount    int       `json:"amount"`
	Reference string    `json:"reference"` // milestone/project id
	CreatedAt time.Time `json:"created_at"`
}