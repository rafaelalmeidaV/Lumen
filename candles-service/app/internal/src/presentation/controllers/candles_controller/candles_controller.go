package candles

import (
	"net/http"

	usecases "candles-service/internal/src/application/use-cases"
	candlesDTO "candles-service/internal/src/domain/candles/DTO"
	"candles-service/internal/src/domain/candles/entity"


	"github.com/gin-gonic/gin"
)

type CandleHandlers struct {
	createUC  *usecases.CreateCandleUseCase
	getByIDUC *usecases.GetCandleByIDUseCase
	getAllUC  *usecases.GetCandlesUseCase
}

func RegisterCandlesRoutes(
	r *gin.Engine,
	createUC *usecases.CreateCandleUseCase,
	getByIDUC *usecases.GetCandleByIDUseCase,
	getAllUC *usecases.GetCandlesUseCase,
) {
	h := &CandleHandlers{createUC, getByIDUC, getAllUC}

	group := r.Group("/candles")
	{
		group.POST("", h.create)
		group.GET("/:id", h.getByID)
		// group.GET("/:id", auth.JWTMiddleware(), h.getByID)
		group.GET("", h.list)
	}
}

func (h *CandleHandlers) create(c *gin.Context) {
	var input candlesDTO.CandleCreateDTO

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	candle := &entity.Candle{
		City:          input.City,
		State:         input.State,
		DurationHours: input.DurationHours,
		Intention:     input.Intention,
		Type:          input.Type,
	}

	if err := h.createUC.Execute(c.Request.Context(), candle); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "candle created"})
}

func (h *CandleHandlers) getByID(c *gin.Context) {
	id := c.Param("id")

	candle, err := h.getByIDUC.Execute(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	c.JSON(http.StatusOK, candle)
}

func (h *CandleHandlers) list(c *gin.Context) {
	candles, err := h.getAllUC.Execute(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"candles": candles})
}
