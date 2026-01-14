package main

import (
	"log"
	"meu-backend/internal/app"
)

func main() {
	application := app.NewApp()

	if err := application.Start("8080"); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
