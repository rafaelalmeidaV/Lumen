package app

import (
	"log"
	candlesRoutes "meu-backend/internal/handlers/candles"
	healthRoutes "meu-backend/internal/handlers/health"

	"github.com/gin-gonic/gin"
)

type App struct {
	router *gin.Engine
}

func NewApp() *App {
	r := gin.Default()

	setupGlobalMiddlewares(r)

	healthRoutes.RegisterLivenessReadinessRoutes(r)
	candlesRoutes.RegisterCandlesRoutes(r)

	return &App{router: r}
}

func setupGlobalMiddlewares(r *gin.Engine) {
}

func (a *App) Start(port string) error {
	log.Printf("Server running on port %s", port)
	return a.router.Run(":" + port)
}
