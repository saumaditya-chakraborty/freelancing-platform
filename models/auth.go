package models

type LoginRequest struct {
	Email string `json:"email" gorm:"unique"`
	Password string `json:"password"`
}