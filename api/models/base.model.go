package models

import (
	"time"
)

type Base struct {
	ID        uint      `json:"id" gorm:"primaryKey" example:"1"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime" example:"2021-08-01T00:00:00Z"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime" example:"2021-08-01T00:00:00Z"`
}
