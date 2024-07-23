package controllers

import (
	"net/http"
	"strconv"

	"github.com/MTthoas/dex/api/models"
	"github.com/MTthoas/dex/api/platform/database"
	"github.com/MTthoas/dex/api/queries"
	"github.com/gofiber/fiber/v2"
)

// GetTokens function to get all tokens
// @Summary Get all tokens
// @Description Get all tokens
// @Tags Tokens
// @Accept json
// @Produce json
// @Success 200 {object} []models.Token
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/tokens/ethereum [get]
func GetEthereumTokensController(c *fiber.Ctx) error {
	tokens := queries.GetEthereumTokens()
	if tokens == nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get tokens",
		})
	}
	return c.Status(http.StatusOK).JSON(tokens)
}

// GetToken function to get token by Address
// @Summary Get token by Address
// @Description Get token by Address
// @Tags Tokens
// @Accept json
// @Produce json
// @Param address path string true "Address of the token"
// @Success 200 {object} models.Token
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/tokens/ethereum/{address} [get]
func GetEthereumTokenByAddressController(c *fiber.Ctx) error {
	address := c.Params("address")
	token := queries.GetEthereumTokenByAddress(address)
	if token == nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "Token not found",
		})
	}
	return c.Status(http.StatusOK).JSON(token)
}

// CreateToken function to create a new token
// @Summary Create a new token
// @Description Create a new token
// @Tags Tokens
// @Accept json
// @Produce json
// @Param token body models.Token true "Token object"
// @Success 201 {object} models.Token
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/tokens [post]
func CreateTokenController(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	token := new(models.Token)
	if err := c.BodyParser(token); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse request body",
		})
	}

	// Verify if the token already exists with the same address
	existingTokenByAddress, err := db.TokenQueries.GetTokenByAddress(token.Address)
	if err == nil && existingTokenByAddress.Id != 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Token with this address already exists",
		})
	}

	// Verify if the token already exists with the same symbol
	existingTokenBySymbol, err := db.TokenQueries.GetTokenBySymbol(token.Symbol)
	if err == nil && existingTokenBySymbol.Id != 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Token with this symbol already exists",
		})
	}

	createdToken, err := db.TokenQueries.CreateToken(*token)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(createdToken)
}

// UpdateToken function to update an existing token
// @Summary Update an existing token
// @Description Update an existing token
// @Tags Tokens
// @Accept json
// @Produce json
// @Param id path string true "ID of the token"
// @Param token body models.Token true "Token object"
// @Success 200 {object} models.Token
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/tokens/{id} [put]
func UpdateTokenController(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	id := c.Params("id")
	uintID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ID format",
		})
	}

	token := new(models.Token)
	if err := c.BodyParser(token); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse request body",
		})
	}

	token.Id = uint(uintID) // Set the ID of the token to be updated

	updatedToken, err := db.TokenQueries.UpdateToken(*token)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": updatedToken,
	})
}

// DeleteToken function to delete a token
// @Summary Delete a token
// @Description Delete a token
// @Tags Tokens
// @Param id path string true "ID of the token"
// @Success 204 {object} nil
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/tokens/{id} [delete]
func DeleteTokenController(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	id := c.Params("id")
	if err := db.TokenQueries.DeleteToken(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{
		"msg": "Token deleted",
	})
}

// GetTokens function to get all tokens
// @Summary Get all tokens
// @Description Get all tokens
// @Tags Tokens
// @Accept json
// @Produce json
// @Success 200 {object} []models.Token
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/tokens [get]
func GetTokensController(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	tokens, err := db.TokenQueries.GetTokens()
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(tokens)

}

// GetTokenById function to get token by ID
// @Summary Get token by ID
// @Description Get token by ID
// @Tags Tokens
// @Accept json
// @Produce json
// @Param id path string true "ID of the token"
// @Success 200 {object} models.Token
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/tokens/id/{id} [get]
func GetTokenByIdController(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	id := c.Params("id")
	token, err := db.TokenQueries.GetTokenById(id)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(token)
}

// GetTokenBySymbol function to get token by Symbol
// @Summary Get token by Symbol
// @Description Get token by Symbol
// @Tags Tokens
// @Accept json
// @Produce json
// @Param symbol path string true "Symbol of the token"
// @Success 200 {object} models.Token
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/tokens/symbol/{symbol} [get]
func GetTokenBySymbolController(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	symbol := c.Params("symbol")
	token, err := db.TokenQueries.GetTokenBySymbol(symbol)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(token)

}

// GetTokenByAddress function to get token by Address
// @Summary Get token by Address
// @Description Get token by Address
// @Tags Tokens
// @Accept json
// @Produce json
// @Param address path string true "Address of the token"
// @Success 200 {object} models.Token
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/tokens/address/{address} [get]
func GetTokenByAddressController(c *fiber.Ctx) error {
	db, err := database.OpenDBConnection()
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	address := c.Params("address")
	token, err := db.TokenQueries.GetTokenByAddress(address)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(http.StatusOK).JSON(token)
}
