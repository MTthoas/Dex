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
	route.Post("/user", controllers.CreateUser)
	route.Put("/user", controllers.UpdateUser)
	route.Delete("/user/:id", controllers.DeleteUser)

	route.Get("/transactions", controllers.GetTransactions)
	route.Get("/transaction/:id", controllers.GetTransaction)
	route.Post("/transaction", controllers.CreateTransaction)
	route.Put("/transaction", controllers.UpdateTransaction)
	route.Delete("/transaction/:id", controllers.DeleteTransaction)

	// Routes for GET method:
	route.Get("/api/coins", controllers.GetCoins)

}
