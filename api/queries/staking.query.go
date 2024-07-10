package queries

import (
	"github.com/MTthoas/dex/api/models"
	"gorm.io/gorm"
)

type StakingQueries struct {
	DB *gorm.DB
}

func (sq *StakingQueries) GetAllStakings() ([]models.Staking, error) {
	var stakings []models.Staking
	if err := sq.DB.Find(&stakings).Error; err != nil {
		return nil, err
	}
	return stakings, nil
}

func (sq *StakingQueries) GetStakingByID(id int) (models.Staking, error) {
	var staking models.Staking
	if err := sq.DB.First(&staking, id).Error; err != nil {
		return models.Staking{}, err
	}
	return staking, nil
}

func (sq *StakingQueries) GetStakingByAddress(address string) (models.Staking, error) {
	var staking models.Staking
	if err := sq.DB.Where("address = ?", address).First(&staking).Error; err != nil {
		return models.Staking{}, err
	}
	return staking, nil
}

func (sq *StakingQueries) GetStakingByUserID(userId int) ([]models.Staking, error) {
	var stakings []models.Staking
	if err := sq.DB.Where("user_id = ?", userId).Find(&stakings).Error; err != nil {
		return nil, err
	}
	return stakings, nil
}

func (sq *StakingQueries) CreateStaking(staking models.Staking) (models.Staking, error) {
	if staking.Address != "" {
		if err := sq.DB.Create(&staking).Error; err != nil {
			return models.Staking{}, err
		}
		return staking, nil
	}
	return models.Staking{}, nil
}

func (sq *StakingQueries) UpdateStaking(staking models.Staking) (models.Staking, error) {
	if _, err := sq.GetStakingByAddress(staking.Address); err != nil {
		return models.Staking{}, nil
	}
	if err := sq.DB.Save(&staking).Error; err != nil {
		return models.Staking{}, err
	}
	return staking, nil
}

func (sq *StakingQueries) DeleteStaking(id int) error {
	if err := sq.DB.Delete(&models.Staking{}, id).Error; err != nil {
		return err
	}
	return nil
}