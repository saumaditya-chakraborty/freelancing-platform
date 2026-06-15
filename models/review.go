package models

import "time"

// Review handles bidirectional reputation ratings on completed contracts
type Review struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	ProjectID  uint      `json:"project_id" gorm:"not null"`
	Project    Project   `json:"project,omitempty" gorm:"foreignKey:ProjectID;constraint:OnDelete:CASCADE;"`
	ReviewerID uint      `json:"reviewer_id" gorm:"not null"`
	Reviewer   User      `json:"reviewer,omitempty" gorm:"foreignKey:ReviewerID"`
	RevieweeID uint      `json:"reviewee_id" gorm:"not null"`
	Reviewee   User      `json:"reviewee,omitempty" gorm:"foreignKey:RevieweeID"`
	Rating     int       `json:"rating" gorm:"not null" validate:"required,min=1,max=5"` // Enforces 1-5 star bounds
	Comment    string    `json:"comment" gorm:"type:text"`
	CreatedAt  time.Time `json:"created_at"`
}