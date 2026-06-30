package models

type Proposal struct {
	ID           uint    `gorm:"primaryKey" json:"id"`
	ProjectID    uint    `json:"project_id"`
	FreelancerID uint    `json:"freelancer_id"`
	BidAmount    float64 `json:"bid_amount"`
	CoverLetter  string  `json:"cover_letter"`
	DeliveryDays int     `json:"delivery_days"`
	Status       string  `json:"status"`

	Project Project `gorm:"foreignKey:ProjectID" json:"project"`
}