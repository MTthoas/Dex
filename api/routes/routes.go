package routes

import (
	"github.com/MTthoas/dex/api/controllers"
	"github.com/gofiber/fiber/v2"
)

// PublicRoutes func for describe group of public routes.
func PublicRoutes(a *fiber.App) {
	// Create routes group.
	route := a.Group("/api/v1")

	route.Get("/healthCheck", controllers.HealthCheck)

	route.Get("/users", controllers.GetUsers)
	route.Get("/user/:id", controllers.GetUsers)

	// Routes for GET method:
	route.Get("/api/coins", controllers.GetCoins)

}
