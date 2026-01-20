package candles

import (
	candlesService "candles-service/internal/domain/candles"
	candlesDTO "candles-service/internal/domain/candles/DTO"
	auth "candles-service/internal/auth"
	"fmt"

	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterCandlesRoutes(r *gin.Engine, service *candlesService.CandleService) {
	routes := r.Group("/candles")
	{
		routes.POST("", func(c *gin.Context) {
			createCandleHandler(c, service)
		})
		routes.GET("/:id", auth.JWTMiddleware(), func(c *gin.Context) {
			getCandleByIDHandler(c, service)
		})
		routes.GET("", func(c *gin.Context) {
			listCandlesHandler(c, service)
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

	result, err := service.CreateCandle(c.Request.Context(), input)

	if err != nil {
		fmt.Printf("Service error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Candle created and sent to service layer")
	c.JSON(http.StatusCreated, result)
}

func getCandleByIDHandler(c *gin.Context, service *candlesService.CandleService) {
	id := c.Param("id")

	candle, err := service.GetCandleByID(c.Request.Context(), id)
	if err != nil {
		fmt.Printf("Service error: %v\n", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Candle not found"})
		return
	}

	c.JSON(http.StatusOK, candle)
}

func listCandlesHandler(c *gin.Context, service *candlesService.CandleService) {
	candles, err := service.ListCandles(c.Request.Context())
	if err != nil {
		fmt.Printf("Service error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list candles"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"candles": candles})
}
