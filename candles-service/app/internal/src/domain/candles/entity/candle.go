package entity

import (
	"time"

	"candles-service/internal/src/domain/candles/enums"
)

type Candle struct {
	ID        string
	City      string
	State     enums.BrazilState
	ExpiredAt time.Time
	CreatedAt time.Time
	Intention string
	Type      enums.CandleType
}
