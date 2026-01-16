package validations

import (
	candleCreateDTO "candles-service/internal/domain/candles/DTO"
	"candles-service/internal/domain/candles/enums"
	"errors"
	"fmt"
)

var ErrValidation = errors.New("validation error")

type candleValidator func(dto candleCreateDTO.CandleCreateDTO) error

func IsValid(dto candleCreateDTO.CandleCreateDTO) error {
	validators := []candleValidator{
		validateType,
		validateDuration,
		validateIntention,
		validateState,
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

func validateState(dto candleCreateDTO.CandleCreateDTO) error {
	switch dto.State {
	case enums.AC, enums.AL, enums.AP, enums.AM, enums.BA, enums.CE, enums.DF, enums.ES, enums.GO,
		enums.MA, enums.MT, enums.MS, enums.MG, enums.PA, enums.PB, enums.PR, enums.PE, enums.PI,
		enums.RJ, enums.RN, enums.RS, enums.RO, enums.RR, enums.SC, enums.SP, enums.SE, enums.TO:
		return nil
	}
	return fmt.Errorf("invalid brazil state: %s", dto.State)
}
