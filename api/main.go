package main

import (
	"log"

	"github.com/MTthoas/dex/api/configs"
	_ "github.com/MTthoas/dex/api/docs"
	"github.com/MTthoas/dex/api/middleware"
	"github.com/MTthoas/dex/api/routes"
	"github.com/MTthoas/dex/api/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	_ "github.com/joho/godotenv/autoload"
)

func main() {


	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	print(err)

	config := configs.FiberConfig()

	app := fiber.New(config)

	// Middlewares.
	middleware.FiberMiddleware(app)

	// Routes.
	routes.PublicRoutes(app)  // Register a public routes for app.
	routes.SwaggerRoute(app)  // Register a route for API Docs (Swagger).
	routes.NotFoundRoute(app) // Register route for 404 Error.

	// Start server (with graceful shutdown).
	utils.StartServer(app)
}
