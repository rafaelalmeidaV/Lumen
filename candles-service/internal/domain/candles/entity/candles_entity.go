package entity

import "time"

type Candle struct {
	ID            string
	Type          string
	Description   string
	Intention 	  string
	ExpiresAt     time.Time
	CreatedAt     time.Time
}
