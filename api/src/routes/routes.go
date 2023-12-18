package routes

import (
    "github.com/MTthoas/dex/api/src/controller"
    "github.com/gin-gonic/gin"
)

func InitializeRoutes(router *gin.Engine) {
    router.GET("/exemple", controllers.ExempleGet)
}
