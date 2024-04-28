package models

type User struct {
	Base
	Name    string `json:"name" gorm:"not null" example:"John Doe"`
	Address string `json:"address" gorm:"unique" example:"0x123abc" validate:"required"`
}

func (user *User) TableName() string {
	return "user"
}
