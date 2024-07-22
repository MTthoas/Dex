package models

type User struct {
	Base
	Name    string `json:"name" gorm:"not null" example:"John Doe"`
	Address string `json:"address" gorm:"unique" example:"0x123abc" validate:"required"`
	Banned  bool   `json:"banned" gorm:"default:false" example:"false"`
}

func (user *User) TableName() string {
	return "user"
}
