package models

type Wallet struct {
	ID        uint `json:"id" gorm:"primaryKey"`
	UserID    uint `json:"user_id"`
	Balance   int  `json:"balance"`
}