package usecases

import (
	"context"

	"candles-service/internal/src/domain/candles/entity"
	"candles-service/internal/src/domain/candles/repository"
)

type CreateCandleUseCase struct {
	repo repository.CandleRepository
}

func NewCreateCandleUseCase(r repository.CandleRepository) *CreateCandleUseCase {
	return &CreateCandleUseCase{repo: r}
}

func (uc *CreateCandleUseCase) Execute(
	ctx context.Context,
	candle *entity.Candle,
) error {
	return uc.repo.Save(ctx, candle)
}
