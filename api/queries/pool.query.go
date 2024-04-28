package queries

import (
	"github.com/MTthoas/dex/api/models"
	"gorm.io/gorm"
)

type PoolQueries struct {
	DB *gorm.DB
}

func (pq *PoolQueries) GetAllPools() ([]models.Pool, error) {
	var pools []models.Pool
	if err := pq.DB.Find(&pools).Error; err != nil {
		return nil, err
	}
	return pools, nil
}

func (pq *PoolQueries) GetPoolByID(id int) (models.Pool, error) {
	var pool models.Pool
	if err := pq.DB.First(&pool, id).Error; err != nil {
		return models.Pool{}, err
	}
	return pool, nil
}

func (pq *PoolQueries) CreatePool(pool models.Pool) (models.Pool, error) {
	if err := pq.DB.Create(&pool).Error; err != nil {
		return models.Pool{}, err
	}
	return pool, nil
}

func (pq *PoolQueries) UpdatePool(pool models.Pool) (models.Pool, error) {
	if err := pq.DB.Save(&pool).Error; err != nil {
		return models.Pool{}, err
	}
	return pool, nil
}

func (pq *PoolQueries) DeletePool(id int) error {
	if err := pq.DB.Delete(&models.Pool{}, id).Error; err != nil {
		return err
	}
	return nil
}
