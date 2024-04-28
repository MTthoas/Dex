package controllers

import (
	"net/http"

	"github.com/MTthoas/dex/api/services"
	"github.com/gofiber/fiber/v2"
)

// GetCoins function to get all coins
// @Summary Get all coins
// @Description Get all coins
// @Tags Coins
// @Accept json
// @Produce json
// @Success 200 {object} []models.Token
// @Router /api/coins [get]
func GetCoins(c *fiber.Ctx) error {
	coins := services.ScrapeEthereumTokens()
	return c.Status(http.StatusOK).JSON(coins)
}
