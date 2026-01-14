package candles

import (
	"meu-backend/internal/domain/candles"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func RegisterCandlesRoutes(r *gin.Engine) {
	routes := r.Group("/candles")
	{
		routes.POST("", createCandleHandler)
	}
}

func createCandleHandler(c *gin.Context) {
	var input candles.CandleCreateDTO

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	expiresAt := time.Now().Add(time.Duration(input.DurationHours) * time.Hour)

	c.JSON(http.StatusCreated, gin.H{
		"message":       "Vela acesa com sucesso",
		"type":          input.Type,
		"justification": input.Justification,
		"expires_at":    expiresAt.Format(time.RFC3339),
	})
}
