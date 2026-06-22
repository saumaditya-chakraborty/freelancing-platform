package models

import "time"

type Conversation struct {
	ID uint `gorm:"primaryKey"`

	User1ID uint `json:"user1_id"`
	User2ID uint `json:"user2_id"`

	LastMessage string `json:"last_message"`

	LastMessageAt time.Time `json:"last_message_at"`

	CreatedAt time.Time
	UpdatedAt time.Time
}