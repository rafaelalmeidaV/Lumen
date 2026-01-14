package candles

type CandleCreateDTO struct {
    Type          string `json:"type" binding:"required"`
    Justification string `json:"justification" binding:"required"`
    DurationHours int    `json:"duration_hours" binding:"required"`
}
