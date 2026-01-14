package candles

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Candle struct {
	ID            bson.ObjectID `bson:"_id,omitempty"`
	Type          string        `bson:"type"`
	Justification string        `bson:"justification"`
	ExpiresAt     time.Time     `bson:"expires_at"`
	CreatedAt     time.Time     `bson:"created_at"`
}
