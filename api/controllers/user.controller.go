package controllers

import (
	"github.com/MTthoas/dex/api/models"
	"github.com/MTthoas/dex/api/platform/database"
	"github.com/MTthoas/dex/api/utils"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetUsers function to get all users
// @Summary Get all users
// @Description Retrieves a list of all users in the database.
// @Tags User
// @Accept json
// @Produce json
// @Success 200 {object} models.User
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users [get]
func GetUsers(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	users, err := db.UserQueries.GetAllUsers()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": users,
	})
}

// GetUser function to get user by ID
// @Summary Get user by ID
// @Description Retrieves a user by ID from the database.
// @Tags User
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} models.User
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users/{id} [get]
func GetUser(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	id := c.Params("id")
	user, err := db.UserQueries.GetUserByID(utils.StringToInt(id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": true,
				"msg":   "user not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": user,
	})
}

// GetUserByAddress function to get user by address
// @Summary Get user by address
// @Description Retrieves a user by address from the database.
// @Tags User
// @Accept json
// @Produce json
// @Param address path string true "User address"
// @Success 200 {object} models.User
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users/address/{address} [get]
func GetUserByAddress(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	address := c.Params("address")
	user, err := db.UserQueries.GetUserByAddress(address)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": true,
				"msg":   "user not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": user,
	})
}

// GetUsersBanned function to get all banned users
// @Summary Get all banned users
// @Description Retrieves a list of all banned users in the database.
// @Tags User
// @Accept json
// @Produce json
// @Success 200 {object} models.User
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users/banned [get]
func GetUsersBanned(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	users, err := db.UserQueries.GetAllUsersBanned()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": users,
	})
}

// CreateUser function to create a new user
// @Summary Create a new user
// @Description Creates a new user in the database.
// @Tags User
// @Accept json
// @Produce json
// @Param user body models.User true "User object"
// @Success 201 {object} models.User
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users [post]
func CreateUser(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	newUser, err := db.UserQueries.CreateUser(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"data": newUser,
	})
}

// UpdateUser function to update a user
// @Summary Update a user
// @Description Updates a user in the database.
// @Tags User
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param user body models.User true "User object"
// @Success 200 {object} models.User
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users/{id} [put]
func UpdateUser(c *fiber.Ctx) error {

	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	id := c.Params("id")
	user, err := db.UserQueries.GetUserByID(utils.StringToInt(id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": true,
				"msg":   "user not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	updatedUser, err := db.UserQueries.UpdateUser(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": updatedUser,
	})
}

// DeleteUser function to delete a user
// @Summary Delete a user
// @Description Deletes a user from the database.
// @Tags User
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 204
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/users/{id} [delete]
func DeleteUser(c *fiber.Ctx) error {

	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	id := c.Params("id")
	err = db.UserQueries.DeleteUser(utils.StringToInt(id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": true,
				"msg":   "user not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusNoContent).JSON(nil)
}
