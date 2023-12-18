package main

import (
    "github.com/MTthoas/dex/api/src/routes"
    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()

    // Configuration des routes
    routes.InitializeRoutes(router)

    // Démarrer le serveur
    router.Run(":8080")
}
