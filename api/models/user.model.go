package models

type User struct {
	Base
	Name      string    `json:"name"`
	Address   string    `json:"address" gorm:"unique"`
}
