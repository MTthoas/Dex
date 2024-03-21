package routes

import (
	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
)

func SwaggerRoute(a *fiber.App) {
	route := a.Group("/swagger")
	// Routes for GET method:
	route.Get("*", swagger.HandlerDefault)
}
