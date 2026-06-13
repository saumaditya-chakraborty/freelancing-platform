package models
// igve image 
type Project struct {
	ID          int     `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Budget      float64 `json:"budget"`
	ClientID    int     `json:"client_id"`
}