package candles

import "candles-service/internal/domain/candles/enums"

type CandleCreateDTO struct {
	City          string           `json:"city" binding:"required"`
	State         string           `json:"state" binding:"required"`
	DurationHours int              `json:"duration_hours" binding:"required"`
	Intention     string           `json:"intention" binding:"required"`
	Type          enums.CandleType `json:"type" binding:"required"`
}
