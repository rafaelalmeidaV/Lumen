package repository

import (
	"context"
	"errors"

	"candles-service/internal/database/models"
	candlesEntity "candles-service/internal/domain/candles/entity"

	"go.mongodb.org/mongo-driver/v2/bson"
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
	model := models.FromEntity(candle)
	_, err := r.collection.InsertOne(ctx, model)
	return err
}

func (r *MongoCandleRepository) FindByID(ctx context.Context, id string) (*candlesEntity.Candle, error) {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid ID format")
	}

	var model models.CandleModel
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&model)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("candle not found")
		}
		return nil, err
	}

	return model.ToEntity(), nil
}

func (r *MongoCandleRepository) FindAll(ctx context.Context) ([]*candlesEntity.Candle, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var modelsList []models.CandleModel
	if err = cursor.All(ctx, &modelsList); err != nil {
		return nil, err
	}

	candles := make([]*candlesEntity.Candle, len(modelsList))
	for i, model := range modelsList {
		candles[i] = model.ToEntity()
	}

	return candles, nil
}
