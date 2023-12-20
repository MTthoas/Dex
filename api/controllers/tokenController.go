package controllers

import (
    "github.com/MTthoas/dex/api/services"
    "github.com/gofiber/fiber/v2"
    "net/http"
)

func GetCoins(c *fiber.Ctx) error {
    coins := services.ScrapeEthereumTokens()
    return c.Status(http.StatusOK).JSON(coins)
}
