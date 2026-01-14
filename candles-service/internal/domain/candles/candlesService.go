package candles

import (
	"context"
	"time"

	candlesDTO "meu-backend/internal/domain/candles/DTO"
	candlesEntity "meu-backend/internal/domain/candles/entity"
)

type CandleGateway interface {
	Save(ctx context.Context, candle *candlesEntity.Candle) error
}

type CandleService struct {
	gateway CandleGateway
}

func NewCandleService(gw CandleGateway) *CandleService {
	return &CandleService{gateway: gw}
}

func (s *CandleService) CreateCandle(ctx context.Context, dto candlesDTO.CandleCreateDTO) error {
	candle := &candlesEntity.Candle{
		Type:          dto.Type,
		Justification: dto.Justification,
		ExpiresAt:     time.Now().Add(time.Duration(dto.DurationHours) * time.Hour),
		CreatedAt:     time.Now(),
	}

	return s.gateway.Save(ctx, candle)
}
