package candles

import (
	"context"
	"time"

	candlesDTO "candles-service/internal/domain/candles/DTO"
	candlesEntity "candles-service/internal/domain/candles/entity"
	candleValidator "candles-service/internal/domain/candles/validations"
)

type CandleGateway interface {
	Save(ctx context.Context, candle *candlesEntity.Candle) error
	FindByID(ctx context.Context, id string) (*candlesEntity.Candle, error)
	FindAll(ctx context.Context) ([]*candlesEntity.Candle, error)
}

type CandleService struct {
	gateway CandleGateway
}

func NewCandleService(gw CandleGateway) *CandleService {
	return &CandleService{gateway: gw}
}

func (s *CandleService) CreateCandle(ctx context.Context, dto candlesDTO.CandleCreateDTO) (*candlesEntity.Candle, error) {
	if err := candleValidator.IsValid(dto); err != nil {
		return nil, err
	}

	candle := &candlesEntity.Candle{
		Type:        dto.Type,
		Intention:   dto.Intention,
		City:        dto.City,
		State:       dto.State,
		Description: dto.Type.GetDescription(),
		ExpiresAt:   time.Now().Add(time.Duration(dto.DurationHours) * time.Hour),
		CreatedAt:   time.Now(),
	}

	if err := s.gateway.Save(ctx, candle); err != nil {
		return nil, err
	}

	return candle, nil
}

func (s *CandleService) GetCandleByID(ctx context.Context, id string) (*candlesEntity.Candle, error) {
	return s.gateway.FindByID(ctx, id)
}

func (s *CandleService) ListCandles(ctx context.Context) ([]*candlesEntity.Candle, error) {
	return s.gateway.FindAll(ctx)
}
