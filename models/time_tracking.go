package models

import "time"

type TimeTracking struct {
	ID uint `gorm:"primaryKey" json:"id"`

	ProjectID uint `json:"project_id"`
	FreelancerID uint `json:"freelancer_id"`

	Status string `json:"status"`

	TotalSeconds int `json:"total_seconds"`

	CreatedAt time.Time
	UpdatedAt time.Time
}