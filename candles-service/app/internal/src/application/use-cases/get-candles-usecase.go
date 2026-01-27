package usecases

import (
	"context"

	"candles-service/internal/src/domain/candles/entity"
	"candles-service/internal/src/domain/candles/repository"
)

type GetCandlesUseCase struct {
	repo repository.CandleRepository
}

func NewGetCandlesUseCase(r repository.CandleRepository) *GetCandlesUseCase {
	return &GetCandlesUseCase{repo: r}
}

func (uc *GetCandlesUseCase) Execute(
	ctx context.Context,
) ([]*entity.Candle, error) {
	return uc.repo.FindAll(ctx)
}
