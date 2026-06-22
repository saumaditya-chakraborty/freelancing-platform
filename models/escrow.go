package models
type Escrow struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	ProjectID   uint   `json:"project_id"`
	MilestoneID uint   `json:"milestone_id"`

	ClientID    uint   `json:"client_id"`
	FreelancerID uint  `json:"freelancer_id"`

	Amount      int    `json:"amount"`
	Status      string `json:"status"` 
	// funded | locked | released | refunded
}