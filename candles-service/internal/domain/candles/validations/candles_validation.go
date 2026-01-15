package validations

import (
	"errors"
	"fmt"
	candleCreateDTO "meu-backend/internal/domain/candles/DTO"
	"meu-backend/internal/domain/candles/enums"
)

var ErrValidation = errors.New("validation error")

type candleValidator func(dto candleCreateDTO.CandleCreateDTO) error

func IsValid(dto candleCreateDTO.CandleCreateDTO) error {
	validators := []candleValidator{
		validateType,
		validateDuration,
		validateIntention,
	}

	for _, fn := range validators {
		if err := fn(dto); err != nil {
			return fmt.Errorf("%w: %v", ErrValidation, err)
		}
	}

	return nil
}

func validateType(dto candleCreateDTO.CandleCreateDTO) error {
	switch dto.Type {
	case enums.CandleTypeWhite, enums.CandleTypeRed, enums.CandleTypeGreen, enums.CandleTypePurple, enums.CandleTypePink:
		return nil
	}
	return fmt.Errorf("invalid type: %s", dto.Type)
}

func validateDuration(dto candleCreateDTO.CandleCreateDTO) error {
	if dto.DurationHours <= 0 {
		return errors.New("duration must be greater than zero")
	}
	return nil
}

func validateIntention(dto candleCreateDTO.CandleCreateDTO) error {
	if len(dto.Intention) < 3 {
		return errors.New("intention is too short")
	}
	return nil
}
