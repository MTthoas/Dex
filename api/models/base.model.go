package models

import (
	"time"
)

type Base struct {
	Id        uint      `json:"id" gorm:"unique;primaryKey;autoIncrement"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime" example:"2021-08-01T00:00:00Z"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime" example:"2021-08-01T00:00:00Z"`
}
