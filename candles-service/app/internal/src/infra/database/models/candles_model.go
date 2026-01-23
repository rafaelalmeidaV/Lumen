package models

import (
	"candles-service/internal/src/domain/candles/entity"
	"candles-service/internal/src/domain/candles/enums"
)

type CandleModel struct {
	ID            string            `bson:"_id,omitempty"`
	City          string            `bson:"city"`
	State         enums.BrazilState `bson:"state"`
	DurationHours int               `bson:"duration_hours"`
	Intention     string            `bson:"intention"`
	Type          enums.CandleType  `bson:"type"`
}

func FromEntity(c *entity.Candle) *CandleModel {
	return &CandleModel{
		City:          c.City,
		State:         c.State,
		DurationHours: c.DurationHours,
		Intention:     c.Intention,
		Type:          c.Type,
	}
}

func (m *CandleModel) ToEntity() *entity.Candle {
	return &entity.Candle{
		ID:            m.ID,
		City:          m.City,
		State:         m.State,
		DurationHours: m.DurationHours,
		Intention:     m.Intention,
		Type:          m.Type,
	}
}
