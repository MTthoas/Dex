package controllers

import "github.com/gofiber/fiber/v2"

// HealthCheck function to check server health
// @Summary Check server health
// @Description Check server health
// @Tags HealthCheck
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /api/v1/healthCheck [get]
func HealthCheck(c *fiber.Ctx) error {
	res := map[string]interface{}{
		"data": "Server is up and running",
	}

	if err := c.JSON(res); err != nil {
		return err
	}

	return nil
}
