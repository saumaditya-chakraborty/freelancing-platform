package models

type Proposal struct {
	ID           uint   `json:"id" gorm:"primaryKey"`
	ProjectID    uint   `json:"project_id"`
	FreelancerID uint   `json:"freelancer_id"`
	Message      string `json:"message"`
	BidAmount    int    `json:"bid_amount"`

	Status       string `json:"status" gorm:"type:varchar(50);default:'pending'"`
}