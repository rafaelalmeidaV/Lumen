package entity

import "candles-service/internal/src/domain/candles/enums"

type Candle struct {
	ID            string
	City          string
	State         enums.BrazilState
	DurationHours int
	Intention     string
	Type          enums.CandleType
}
