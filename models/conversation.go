package models

import "time"

type Conversation struct {
	ID uint `gorm:"primaryKey" json:"id"`

	ProjectID uint `json:"project_id"`
	Project   Project `gorm:"foreignKey:ProjectID" json:"project"`

	ClientID uint `json:"client_id"`
	Client   User `gorm:"foreignKey:ClientID" json:"client"`

	FreelancerID uint `json:"freelancer_id"`
	Freelancer   User `gorm:"foreignKey:FreelancerID" json:"freelancer"`

	LastMessage string `json:"last_message"`

	LastMessageAt time.Time `json:"last_message_at"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}