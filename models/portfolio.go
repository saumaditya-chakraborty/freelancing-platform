package models

import "time"

type Portfolio struct {
	ID uint `json:"id" gorm:"primaryKey"`

	FreelancerID uint `json:"freelancer_id"`
	ClientID     uint `json:"client_id"`
	ProjectID    uint `json:"project_id"`

	Title        string `json:"title"`
	Description  string `json:"description"`
	GithubURL    string `json:"github_url"`
	DemoURL      string `json:"demo_url"`
	ImageURL     string `json:"image_url"`
	Technologies string `json:"technologies"`

	Status string `json:"status" gorm:"default:'draft'"`

	CreatedAt time.Time
	UpdatedAt time.Time
}