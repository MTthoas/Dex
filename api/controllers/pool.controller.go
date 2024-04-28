package controllers

import (
	"github.com/MTthoas/dex/api/models"
	"github.com/MTthoas/dex/api/platform/database"
	"github.com/MTthoas/dex/api/utils"
	"github.com/gofiber/fiber/v2"
)

// GetPools function to get all pools
// @Summary Get all pools
// @Description Get all pools
// @Tags Pools
// @Accept json
// @Produce json
// @Success 200 {object} []models.Pool
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/pools [get]
func GetPools(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	pools, err := db.PoolQueries.GetAllPools()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": pools,
	})
}

// GetPool function to get pool by ID
// @Summary Get pool by ID
// @Description Get pool by ID
// @Tags Pools
// @Accept json
// @Produce json
// @Param id path int true "ID of the pool"
// @Success 200 {object} models.Pool
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/pools/{id} [get]
func GetPool(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	id := c.Params("id")
	pool, err := db.PoolQueries.GetPoolByID(utils.StringToInt(id))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": pool,
	})
}

// CreatePool function to create a new pool
// @Summary Create a new pool
// @Description Create a new pool
// @Tags Pools
// @Accept json
// @Produce json
// @Param pool body models.Pool true "Pool object"
// @Success 200 {object} models.Pool
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/pools [post]
func CreatePool(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	pool := new(models.Pool)
	if err := c.BodyParser(pool); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	createdPool, err := db.PoolQueries.CreatePool(*pool)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": createdPool,
	})
}

// UpdatePool function to update a pool
// @Summary Update a pool
// @Description Update a pool
// @Tags Pools
// @Accept json
// @Produce json
// @Param pool body models.Pool true "Pool object"
// @Success 200 {object} models.Pool
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/pools [put]
func UpdatePool(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	pool := new(models.Pool)
	if err := c.BodyParser(pool); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	updatedPool, err := db.PoolQueries.UpdatePool(*pool)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": updatedPool,
	})
}

// DeletePool function to delete a pool
// @Summary Delete a pool
// @Description Delete a pool
// @Tags Pools
// @Accept json
// @Produce json
// @Param id path int true "ID of the pool"
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/pools/{id} [delete]
func DeletePool(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	id := c.Params("id")
	if err := db.PoolQueries.DeletePool(utils.StringToInt(id)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"msg": "pool deleted",
	})
}





