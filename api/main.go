package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/MTthoas/dex/api/controllers"
)

func main() {
    app := fiber.New()

    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("Hello, World!")
    })

	app.Get("/coins", controllers.GetCoins)

	

    app.Listen(":3000")
}
