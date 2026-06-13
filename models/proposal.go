package models

type Proposal struct {
	ID        int     `json:"id"`
	ProjectID int     `json:"project_id"`
	UserID    int     `json:"user_id"` // use better name for better readebility 
	BidAmount float64 `json:"bid_amount"`
	Message   string  `json:"message"`
	Status    string  `json:"status"`
}