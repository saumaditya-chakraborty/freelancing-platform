package models

type Payment struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	ProjectID   uint   `json:"project_id"`
	MilestoneID uint   `json:"milestone_id"`
	Amount      int    `json:"amount"`
	Status      string `json:"status"`
}