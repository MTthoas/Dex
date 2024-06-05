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

	// Routes for GET method:
	route.Get("/coins", controllers.GetCoins)
	route.Get("/coins/:addresses", controllers.GetCoinByAddress)

	route.Get("/users", controllers.GetUsers)
	route.Get("/users/:id", controllers.GetUsers)
	route.Get("/users/address/:address", controllers.GetUserByAddress)
	route.Post("/users", controllers.CreateUser)
	route.Put("/users", controllers.UpdateUser)
	route.Delete("/users/:id", controllers.DeleteUser)

	route.Get("/transactions", controllers.GetTransactions)
	route.Get("/transaction/:id", controllers.GetTransaction)
	route.Post("/transactions", controllers.CreateTransaction)
	route.Put("/transactions", controllers.UpdateTransaction)
	route.Delete("/transactions/:id", controllers.DeleteTransaction)

	route.Get("/pools", controllers.GetPools)
	route.Get("/pools/:id", controllers.GetPool)
	route.Post("/pools", controllers.CreatePool)
	route.Put("/pools", controllers.UpdatePool)
	route.Delete("/pools/:id", controllers.DeletePool)

	route.Get("/staking", controllers.GetStaking)
	route.Get("/staking/:id", controllers.GetStakingByID)
	route.Get("/staking/user/:userId", controllers.GetStakingByUserID)
	route.Post("/staking", controllers.CreateStaking)
	route.Put("/staking", controllers.UpdateStaking)
	route.Delete("/staking/:id", controllers.DeleteStaking)
}
