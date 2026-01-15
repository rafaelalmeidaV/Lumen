package models

import (
	"meu-backend/internal/domain/candles/entity"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type CandleModel struct {
	ID          bson.ObjectID `bson:"_id,omitempty"`
	Type        string        `bson:"type"`
	Description string        `bson:"Description"`
	Intention   string        `bson:"Intention"`
	ExpiresAt   time.Time     `bson:"expires_at"`
	CreatedAt   time.Time     `bson:"created_at"`
}

func (m *CandleModel) ToEntity() *entity.Candle {
	return &entity.Candle{
		ID:          m.ID.Hex(),
		Type:        m.Type,
		Description: m.Description,
		Intention:   m.Intention,
		ExpiresAt:   m.ExpiresAt,
		CreatedAt:   m.CreatedAt,
	}
}

func FromEntity(c *entity.Candle) *CandleModel {
	objID, _ := bson.ObjectIDFromHex(c.ID)
	return &CandleModel{
		ID:          objID,
		Type:        c.Type,
		Description: c.Description,
		Intention:   c.Intention,
		ExpiresAt:   c.ExpiresAt,
		CreatedAt:   c.CreatedAt,
	}
}
