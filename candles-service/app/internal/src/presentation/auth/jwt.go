package auth

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
	"candles-service/internal/config"
)

func ParseAndValidate(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, getKey)
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid claims")
	}

	if claims["iss"] != config.Issuer {
		return nil, errors.New("invalid issuer")
	}

	return claims, nil
}
