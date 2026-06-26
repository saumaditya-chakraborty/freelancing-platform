package models

import "time"

type Conversation struct {
    ID uint `gorm:"primaryKey" json:"id"`

    ProjectID uint `json:"project_id"`

    ClientID uint `json:"client_id"`

    FreelancerID uint `json:"freelancer_id"`

    LastMessage string `json:"last_message"`

    LastMessageAt time.Time `json:"last_message_at"`

    CreatedAt time.Time `json:"created_at"`

    UpdatedAt time.Time `json:"updated_at"`
}