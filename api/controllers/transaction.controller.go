package controllers

import (
	"github.com/MTthoas/dex/api/models"
	"github.com/MTthoas/dex/api/platform/database"
	"github.com/MTthoas/dex/api/utils"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetTransactions function to get all transactions
// @Summary Get all transactions
// @Description Retrieves a list of all transactions in the database.
// @Tags Transactions
// @Accept json
// @Produce json
// @Success 200 {object} models.Transaction
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/transactions [get]
func GetTransactions(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	transactions, err := db.TransactionQueries.GetAllTransactions()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": transactions,
	})
}

// GetTransaction function to get transaction by ID
// @Summary Get transaction by ID
// @Description Retrieves a transaction by ID from the database.
// @Tags Transactions
// @Accept json
// @Produce json
// @Param id path int true "Transaction ID"
// @Success 200 {object} models.Transaction
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/transactions/{id} [get]
func GetTransaction(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	id := c.Params("id")
	transaction, err := db.TransactionQueries.GetTransactionByID(utils.StringToInt(id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Transaction not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": transaction,
	})
}

// CreateTransaction function to create a new transaction
// @Summary Create a new transaction
// @Description Creates a new transaction in the database
// @Tags Transactions
// @Accept json
// @Produce json
// @Param transaction body models.Transaction true "Transaction object"
// @Success 200 {object} models.Transaction
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/transactions [post]
func CreateTransaction(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	transaction := new(models.Transaction)
	if err := c.BodyParser(transaction); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	createdTransaction, err := db.TransactionQueries.CreateTransaction(*transaction)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": createdTransaction,
	})
}

// UpdateTransaction function to update a transaction
// @Summary Update a transaction
// @Description Updates a transaction in the database.
// @Tags Transactions
// @Accept json
// @Produce json
// @Param id path int true "Transaction ID"
// @Param transaction body models.Transaction true "Transaction object"
// @Success 200 {object} models.Transaction
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/transactions/{id} [put]
func UpdateTransaction(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	id := c.Params("id")
	// Vérifie si la transaction existe avant la mise à jour
	_, err = db.TransactionQueries.GetTransactionByID(utils.StringToInt(id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(200).JSON(fiber.Map{
				"error": "Transaction not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	transaction := new(models.Transaction)
	if err := c.BodyParser(transaction); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	transaction.Id = uint(utils.StringToInt(id))
	// Assurez-vous que l'ID est correctement défini
	updatedTransaction, err := db.TransactionQueries.UpdateTransaction(*transaction)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": updatedTransaction,
	})
}

// DeleteTransaction function to delete a transaction
// @Summary Delete a transaction
// @Description Deletes a transaction from the database.
// @Tags Transactions
// @Accept json
// @Produce json
// @Param id path int true "Transaction ID"
// @Success 200 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/transactions/{id} [delete]
func DeleteTransaction(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	id := c.Params("id")
	err = db.TransactionQueries.DeleteTransaction(utils.StringToInt(id))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"msg": "Transaction deleted successfully",
	})
}
