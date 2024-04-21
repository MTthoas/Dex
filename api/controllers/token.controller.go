package controllers

import (
	"net/http"

	"github.com/MTthoas/dex/api/queries"
	"github.com/gofiber/fiber/v2"
)

// GetCoins function to get all coins
// @Summary Get all coins
// @Description Get all coins
// @Tags Coins
// @Accept json
// @Produce json
// @Success 200 {object} []models.Token
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/coins [get]
func GetCoins(c *fiber.Ctx) error {
	coins := queries.GetTokens()
	return c.Status(http.StatusOK).JSON(coins)
}

// GetCoin function to get coin by Address
// @Summary Get coin by Address
// @Description Get coin by Address
// @Tags Coins
// @Accept json
// @Produce json
// @Param string path string true "Address of the coin"
// @Success 200 {object} models.Token
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /api/v1/coins/{address} [get]
func GetCoinByAddress(c *fiber.Ctx) error {
	address := c.Params("adress")
	coin := queries.GetTokenByAddress(address)
	return c.Status(http.StatusOK).JSON(coin)
}
