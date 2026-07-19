package models

type User struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`

	AverageRating float64 `json:"average_rating" gorm:"default:0"`
	TotalReviews  int     `json:"total_reviews" gorm:"default:0"`
}