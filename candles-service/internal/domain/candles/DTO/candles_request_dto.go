package candles

import "meu-backend/internal/domain/candles/enums"

type CandleCreateDTO struct {
	City          string           `json:"city" binding:"required"`
	DurationHours int              `json:"duration_hours" binding:"required"`
	Intention     string           `json:"intention" binding:"required"`
	Type          enums.CandleType `json:"type" binding:"required"`
}
