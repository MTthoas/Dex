package queries

import (
	"github.com/MTthoas/dex/api/models"
	"gorm.io/gorm"
)

type UserQueries struct {
	DB *gorm.DB
}

func (uq *UserQueries) GetAllUsers() ([]models.User, error) {
	var users []models.User
	if err := uq.DB.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (uq *UserQueries) GetUserByID(id int) (models.User, error) {
	var user models.User
	if err := uq.DB.First(&user, id).Error; err != nil {
		return models.User{}, err
	}
	return user, nil
}

func (uq *UserQueries) GetUserByAddress(address string) (models.User, error) {
	var user models.User
	if err := uq.DB.Where("address = ?", address).First(&user).Error; err != nil {
		return models.User{}, err
	}
	return user, nil
}

func (uq *UserQueries) GetAllBannedUsers() ([]models.User, error) {
	var users []models.User
	if err := uq.DB.Where("banned = ?", true).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (uq *UserQueries) CreateUser(user models.User) (models.User, error) {
	if err := uq.DB.Create(&user).Error; err != nil {
		return models.User{}, err
	}
	return user, nil
}

func (uq *UserQueries) UpdateUser(user models.User) (models.User, error) {
	if err := uq.DB.Save(&user).Error; err != nil {
		return models.User{}, err
	}
	return user, nil
}

func (uq *UserQueries) DeleteUser(id int) error {
	if err := uq.DB.Delete(&models.User{}, id).Error; err != nil {
		return err
	}
	return nil
}
