package auth

import (
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"errors"
	"math/big"
	"net/http"
	"sync"

	"candles-service/internal/config"
	"github.com/golang-jwt/jwt/v5"
)

type jwksResponse struct {
	Keys []jwk `json:"keys"`
}

type jwk struct {
	Kid string `json:"kid"`
	Kty string `json:"kty"`
	N   string `json:"n"`
	E   string `json:"e"`
	Alg string `json:"alg"`
	Use string `json:"use"`
}

var (
	keyCache = make(map[string]*rsa.PublicKey)
	once     sync.Once
)

func loadJWKS() error {
	resp, err := http.Get(config.JwksURL)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	var jwks jwksResponse
	if err := json.NewDecoder(resp.Body).Decode(&jwks); err != nil {
		return err
	}

	for _, key := range jwks.Keys {
		if key.Kty != "RSA" {
			continue
		}

		pubKey, err := parseRSAPublicKey(key.N, key.E)
		if err != nil {
			continue
		}

		keyCache[key.Kid] = pubKey
	}

	return nil
}

func getKey(token *jwt.Token) (interface{}, error) {
	if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
		return nil, errors.New("algoritmo inválido")
	}

	kid, ok := token.Header["kid"].(string)
	if !ok {
		return nil, errors.New("kid ausente")
	}

	var err error
	once.Do(func() {
		err = loadJWKS()
	})
	if err != nil {
		return nil, err
	}

	key, ok := keyCache[kid]
	if !ok {
		return nil, errors.New("chave pública não encontrada")
	}

	return key, nil
}

func parseRSAPublicKey(nStr, eStr string) (*rsa.PublicKey, error) {
	nBytes, err := base64.RawURLEncoding.DecodeString(nStr)
	if err != nil {
		return nil, err
	}

	eBytes, err := base64.RawURLEncoding.DecodeString(eStr)
	if err != nil {
		return nil, err
	}

	n := new(big.Int).SetBytes(nBytes)

	e := 0
	for _, b := range eBytes {
		e = e<<8 + int(b)
	}

	return &rsa.PublicKey{
		N: n,
		E: e,
	}, nil
}
