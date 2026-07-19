package models

import "time"

type Review struct {
	ID uint `gorm:"primaryKey" json:"id"`

	ProjectID uint `json:"project_id"`
	ClientID uint `json:"client_id"`
	FreelancerID uint `json:"freelancer_id"`

	Rating int `json:"rating"`

	Comment string `json:"comment"`

	CreatedAt time.Time `json:"created_at"`

	Project Project `gorm:"foreignKey:ProjectID" json:"project"`
	Client User `gorm:"foreignKey:ClientID" json:"client"`
	Freelancer User `gorm:"foreignKey:FreelancerID" json:"freelancer"`
}