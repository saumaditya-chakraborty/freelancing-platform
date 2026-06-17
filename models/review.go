package models

type Review struct {
	ID         uint   `json:"id" gorm:"primaryKey"`
	ProjectID  uint   `json:"project_id"`
	ReviewerID uint   `json:"reviewer_id"`
	RevieweeID uint   `json:"reviewee_id"`
	Rating     int    `json:"rating"`
	Comment    string `json:"comment"`
}