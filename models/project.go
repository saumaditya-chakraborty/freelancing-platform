package models

type Project struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Budget      int    `json:"budget"`
	ClientID    uint   `json:"client_id"`
	Status      string `json:"status"`
}