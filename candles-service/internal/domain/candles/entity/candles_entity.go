package entity

import (
	"candles-service/internal/domain/candles/enums"
	"time"
)

type Candle struct {
	ID          string
	Type        enums.CandleType
	City        string
	State		string
	Description string
	Intention   string
	ExpiresAt   time.Time
	CreatedAt   time.Time
}
