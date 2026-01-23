package repository

import (
	"context"

	"candles-service/internal/src/domain/candles/entity"
)

type CandleRepository interface {
	Save(ctx context.Context, candle *entity.Candle) error
	FindByID(ctx context.Context, id string) (*entity.Candle, error)
	FindAll(ctx context.Context) ([]*entity.Candle, error)
}
