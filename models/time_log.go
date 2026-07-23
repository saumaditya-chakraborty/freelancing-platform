package models

import "time"

type TimeLog struct {
	ID uint `gorm:"primaryKey" json:"id"`

	TimeTrackingID uint `json:"time_tracking_id"`

	StartTime time.Time `json:"start_time"`
	EndTime time.Time `json:"end_time"`

	DurationSeconds int `json:"duration_seconds"`

	CreatedAt time.Time
}