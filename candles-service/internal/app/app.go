package app

import (
	"fmt"
	"log"
	"os"

	"candles-service/internal/database"
	"candles-service/internal/domain/candles"
	candlesRoutes "candles-service/internal/handlers/candles"
	healthRoutes "candles-service/internal/handlers/health"
	usersRoutes "candles-service/internal/handlers/users"
	repository "candles-service/internal/repository/candle"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type App struct {
	router *gin.Engine
}

func NewApp() *App {
	loadEnv()

	client := setupDatabase()

	r := gin.Default()
	setupGlobalMiddlewares(r)

	setupRoutes(r, client)

	return &App{router: r}
}

func loadEnv() {
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file found")
	}
}

func setupDatabase() *mongo.Client {
	uri := os.Getenv("CANDLES_MONGO_URI")
	client, err := database.ConnectMongoDB(uri)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	return client
}

func setupRoutes(r *gin.Engine, client *mongo.Client) {
	dbName := os.Getenv("DB_NAME")

	repo := repository.NewMongoCandleRepository(client, dbName)
	service := candles.NewCandleService(repo)

	healthRoutes.RegisterLivenessReadinessRoutes(r)
	candlesRoutes.RegisterCandlesRoutes(r, service)
	usersRoutes.RegisterUsersRoutes(r)
}

func setupGlobalMiddlewares(r *gin.Engine) {
}

func (a *App) Start(port string) error {
	if port == "" {
		port = os.Getenv("CANDLES_PORT")
		if port == "" {
			port = "8080"
		}
	}

	fmt.Printf("Server running on port %s\n", port)
	return a.router.Run(":" + port)
}
