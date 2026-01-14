package repository

import (
	"context"
	candlesEntity "meu-backend/internal/domain/candles/entity"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

type MongoCandleRepository struct {
	collection *mongo.Collection
}

func NewMongoCandleRepository(db *mongo.Client, dbName string) *MongoCandleRepository {
	return &MongoCandleRepository{
		collection: db.Database(dbName).Collection("candles"),
	}
}

func (r *MongoCandleRepository) Save(ctx context.Context, candle *candlesEntity.Candle) error {
	_, err := r.collection.InsertOne(ctx, candle)
	return err
}
