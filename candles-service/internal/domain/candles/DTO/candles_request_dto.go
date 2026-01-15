package candles

type CandleCreateDTO struct {
    City          string `json:"city" binding:"required"`
    DurationHours int    `json:"duration_hours" binding:"required"`
    Intention     string `json:"intention" binding:"required"`
    Type          string `json:"type" binding:"required"`
}
