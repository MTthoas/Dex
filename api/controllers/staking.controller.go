package controllers

import (
	"github.com/MTthoas/dex/api/models"
	"github.com/MTthoas/dex/api/platform/database"
	"github.com/MTthoas/dex/api/utils"
	"github.com/gofiber/fiber/v2"
)

// GetStaking function to get all staking
// @Summary Get all staking
// @Description Get all staking
// @Tags Staking
// @Accept json
// @Produce json
// @Success 200 {object} []models.Staking
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/staking [get]
func GetStaking(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	stakings, err := db.StakingQueries.GetAllStakings()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": stakings,
	})
}

// GetStakingByID function to get staking by ID
// @Summary Get staking by ID
// @Description Get staking by ID
// @Tags Staking
// @Accept json
// @Produce json
// @Param id path int true "ID of the staking"
// @Success 200 {object} models.Staking
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/staking/{id} [get]
func GetStakingByID(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	id := c.Params("id")
	staking, err := db.StakingQueries.GetStakingByID(utils.StringToInt(id))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": staking,
	})
}

// CreateStaking function to create a new staking
// @Summary Create a new staking
// @Description Create a new staking
// @Tags Staking
// @Accept json
// @Produce json
// @Param staking body models.Staking true "Staking object"
// @Success 200 {object} models.Staking
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/staking [post]
func CreateStaking(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	staking := new(models.Staking)
	if err := c.BodyParser(staking); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	createdStaking, err := db.StakingQueries.CreateStaking(*staking)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": createdStaking,
	})
}

// UpdateStaking function to update a staking
// @Summary Update a staking
// @Description Update a staking
// @Tags Staking
// @Accept json
// @Produce json
// @Param staking body models.Staking true "Staking object"
// @Success 200 {object} models.Staking
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/staking [put]
func UpdateStaking(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	staking := new(models.Staking)
	if err := c.BodyParser(staking); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	updatedStaking, err := db.StakingQueries.UpdateStaking(*staking)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": updatedStaking,
	})
}

// DeleteStaking function to delete a staking
// @Summary Delete a staking
// @Description Delete a staking
// @Tags Staking
// @Accept json
// @Produce json
// @Param id path int true "ID of the staking"
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/staking/{id} [delete]
func DeleteStaking(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	id := c.Params("id")
	err = db.StakingQueries.DeleteStaking(utils.StringToInt(id))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Staking deleted successfully",
	})
}

// GetStakingByUserID function to get staking by user ID
// @Summary Get staking by user ID
// @Description Get staking by user ID
// @Tags Staking
// @Accept json
// @Produce json
// @Param id path int true "ID of the user"
// @Success 200 {object} models.Staking
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/staking/user/{id} [get]
func GetStakingByUserID(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	id := c.Params("id")
	staking, err := db.StakingQueries.GetStakingByUserID(utils.StringToInt(id))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": staking,
	})
}