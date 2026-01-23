package usecases

import (
	"context"

	"candles-service/internal/src/domain/candles/entity"
	"candles-service/internal/src/domain/candles/repository"
)

type GetCandleByIDUseCase struct {
	repo repository.CandleRepository
}

func NewGetCandleByIDUseCase(
	r repository.CandleRepository,
) *GetCandleByIDUseCase {
	return &GetCandleByIDUseCase{repo: r}
}

func (uc *GetCandleByIDUseCase) Execute(
	ctx context.Context,
	id string,
) (*entity.Candle, error) {
	return uc.repo.FindByID(ctx, id)
}
