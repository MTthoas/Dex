package routes

import (
	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
)

func SwaggerRoute(a *fiber.App) {
	a.Get("/swagger/*", swagger.HandlerDefault) // default

	a.Get("/swagger/*", swagger.New(swagger.Config{ // custom
		URL: "http://example.com/doc.json",
		DeepLinking: false,
		DocExpansion: "none",
	}))
}
