package entity

import (
	"candles-service/internal/domain/candles/enums"
	"time"
)

type Candle struct {
	ID          string
	Type        enums.CandleType
	Description string
	Intention   string
	ExpiresAt   time.Time
	CreatedAt   time.Time
}
