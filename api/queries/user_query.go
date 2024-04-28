package queries

import (
	"github.com/MTthoas/dex/api/models"
	"gorm.io/gorm"
)

// UserQueries struct for collect all user queries.

type UserQueries struct {
	DB *gorm.DB
}

// GetAllUsers func for get all users from database.

func (uq *UserQueries) GetAllUsers() ([]models.User, error) {
	var users []models.User
	if err := uq.DB.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// GetUserByID func for get user by ID from database.

func (uq *UserQueries) GetUserByID(id int) (models.User, error) {
	var user models.User
	if err := uq.DB.First(&user, id).Error; err != nil {
		return models.User{}, err
	}
	return user, nil
}

// CreateUser func for create new user in database.

func (uq *UserQueries) CreateUser(user models.User) (models.User, error) {
	if err := uq.DB.Create(&user).Error; err != nil {
		return models.User{}, err
	}
	return user, nil
}

// UpdateUser func for update user in database.

func (uq *UserQueries) UpdateUser(user models.User) (models.User, error) {
	if err := uq.DB.Save(&user).Error; err != nil {
		return models.User{}, err
	}
	return user, nil
}

// DeleteUser func for delete user from database.

func (uq *UserQueries) DeleteUser(id int) error {
	if err := uq.DB.Delete(&models.User{}, id).Error; err != nil {
		return err
	}
	return nil
}
