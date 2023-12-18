package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func ExempleGet(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
        "message": "Ceci est un exemple",
    })
}
