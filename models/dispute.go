package models

import "time"

// Dispute handles arbitration workflows when a client and freelancer have a conflict
type Dispute struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	ProjectID  uint      `json:"project_id" gorm:"not null;unique"` // One dispute per project max
	Project    Project   `json:"project,omitempty" gorm:"foreignKey:ProjectID;constraint:OnDelete:CASCADE;"`
	RaisedByID uint      `json:"raised_by_id" gorm:"not null"`
	RaisedBy   User      `json:"raised_by,omitempty" gorm:"foreignKey:RaisedByID"`
	Reason     string    `json:"reason" gorm:"type:text;not null"`
	Status     string    `json:"status" gorm:"type:varchar(50);default:'open';not null"` // open, resolved, dismissed
	Resolution string    `json:"resolution" gorm:"type:text"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}