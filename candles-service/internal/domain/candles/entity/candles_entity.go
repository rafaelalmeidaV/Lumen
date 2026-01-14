package entity

import "time"

type Candle struct {
	ID            string
	Type          string
	Justification string
	ExpiresAt     time.Time
	CreatedAt     time.Time
}
