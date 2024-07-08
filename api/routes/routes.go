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
	route.Get("/tokens", controllers.GetTokensController)
	route.Get("/tokens/ethereum", controllers.GetEthereumTokensController)
	route.Get("/tokens/ethereum/:addresses", controllers.GetEthereumTokenByAddressController)
	route.Post("/tokens", controllers.CreateTokenController)
	route.Get("/tokens/:id", controllers.GetTokenByIdController)
	route.Get("/tokens/address/:address", controllers.GetTokenByAddressController)
	route.Get("/tokens/symbol/:symbol", controllers.GetTokenBySymbolController)
	route.Put("/tokens/:id", controllers.UpdateTokenController)
	route.Delete("/tokens/:id", controllers.DeleteTokenController)

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
}
