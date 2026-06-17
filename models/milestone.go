package models

type Milestone struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	ProjectID uint   `json:"project_id"`
	Title     string `json:"title"`
	Amount    int    `json:"amount"`
	Status    string `json:"status"`
}