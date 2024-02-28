package controllers

import (
	"net/http"

	"github.com/MTthoas/dex/api/services"
	"github.com/gofiber/fiber/v2"
)

func GetCoins(c *fiber.Ctx) error {
    coins, err := services.ScrapeEthereumTokens()
    if err != nil {
        return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Erreur lors de la récupération des tokens"})
    }
    
    if len(coins) == 0 {
        return c.Status(http.StatusNotFound).JSON(fiber.Map{"message": "Aucun token trouvé"})
    }

    return c.Status(http.StatusOK).JSON(coins)
}

