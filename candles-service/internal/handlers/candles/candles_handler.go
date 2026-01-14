package candles

import (
	"fmt"
	candlesService "meu-backend/internal/domain/candles"
	candlesDTO "meu-backend/internal/domain/candles/DTO"

	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterCandlesRoutes(r *gin.Engine, service *candlesService.CandleService) {
	routes := r.Group("/candles")
	{
		routes.POST("", func(c *gin.Context) {
			createCandleHandler(c, service)
		})
	}
}

func createCandleHandler(c *gin.Context, service *candlesService.CandleService) {
	var input candlesDTO.CandleCreateDTO

	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Printf("Invalid request body: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := service.CreateCandle(c.Request.Context(), input); err != nil {
		fmt.Printf("Service error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create candle"})
		return
	}

	fmt.Println("Candle created and sent to service layer")
	c.JSON(http.StatusCreated, gin.H{"message": "Candle created successfully"})
}
