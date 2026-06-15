package models

import "time"

// Milestone represents an isolated payable phase of work within a contracted project
type Milestone struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	ProjectID uint      `json:"project_id" gorm:"not null"`
	Project   Project   `json:"project,omitempty" gorm:"foreignKey:ProjectID;constraint:OnDelete:CASCADE;"`
	Title     string    `json:"title" gorm:"type:varchar(255);not null"`
	Amount    int       `json:"amount" gorm:"not null"`
	Status    string    `json:"status" gorm:"type:varchar(50);default:'pending';not null"` // pending, funded, submitted, approved
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}