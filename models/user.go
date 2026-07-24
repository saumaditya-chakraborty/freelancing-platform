package models

type User struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Name     string `json:"name"`
	Email    string `json:"email" gorm:"unique"`
	Password string `json:"password"`

	// Roles:
	// client
	// freelancer
	// admin
	Role string `json:"role"`

	AverageRating float64 `json:"average_rating" gorm:"default:0"`
	TotalReviews  int     `json:"total_reviews" gorm:"default:0"`

	// Admin Controls
	IsBlocked bool `json:"is_blocked" gorm:"default:false"`
	IsBanned  bool `json:"is_banned" gorm:"default:false"`
}