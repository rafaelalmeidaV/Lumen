package models

import (
	"time"

	"candles-service/internal/src/domain/candles/entity"
	"candles-service/internal/src/domain/candles/enums"
)

type CandleModel struct {
	ID            string            `bson:"_id,omitempty"`
	City          string            `bson:"city"`
	State         enums.BrazilState `bson:"state"`
	CreatedAt     time.Time         `bson:"created_at"`
	ExpiredAt     time.Time         `bson:"expired_at"`
	Intention     string            `bson:"intention"`
	Type          enums.CandleType  `bson:"type"`
}

func FromEntity(c *entity.Candle) *CandleModel {
	return &CandleModel{
		City:          c.City,
		State:         c.State,
		ExpiredAt:     c.ExpiredAt,
		CreatedAt:     c.CreatedAt,
		Intention:     c.Intention,
		Type:          c.Type,
	}
}

func (m *CandleModel) ToEntity() *entity.Candle {
	return &entity.Candle{
		ID:            m.ID,
		City:          m.City,
		State:         m.State,
		ExpiredAt:     m.ExpiredAt,
		CreatedAt:     m.CreatedAt,
		Intention:     m.Intention,
		Type:          m.Type,
	}
}
