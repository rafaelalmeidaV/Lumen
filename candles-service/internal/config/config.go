package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadConfig() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("No .env file found at root")
	}
}

func GetEnv(key string) string {
	return os.Getenv(key)
}
