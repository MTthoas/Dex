package queries

import (
	"github.com/MTthoas/dex/api/models"
	"gorm.io/gorm"
)

type TransactionQueries struct {
	DB *gorm.DB
}

func (tq *TransactionQueries) GetAllTransactions() ([]models.Transaction, error) {
	var transactions []models.Transaction
	if err := tq.DB.Find(&transactions).Error; err != nil {
		return nil, err
	}
	return transactions, nil
}

func (tq *TransactionQueries) GetTransactionByID(id int) (models.Transaction, error) {
	var transaction models.Transaction
	if err := tq.DB.First(&transaction, id).Error; err != nil {
		return models.Transaction{}, err
	}
	return transaction, nil
}

func (tq *TransactionQueries) CreateTransaction(transaction models.Transaction) (models.Transaction, error) {
	if err := tq.DB.Create(&transaction).Error; err != nil {
		return models.Transaction{}, err
	}
	return transaction, nil
}

func (tq *TransactionQueries) UpdateTransaction(transaction models.Transaction) (models.Transaction, error) {
	if err := tq.DB.Save(&transaction).Error; err != nil {
		return models.Transaction{}, err
	}
	return transaction, nil
}

func (tq *TransactionQueries) DeleteTransaction(id int) error {
	if err := tq.DB.Delete(&models.Transaction{}, id).Error; err != nil {
		return err
	}
	return nil
}
