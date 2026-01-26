package database

import (
	"context"
	"errors"

	"candles-service/internal/src/domain/candles/entity"
	"candles-service/internal/src/domain/candles/enums"
	"candles-service/internal/src/domain/candles/repository"
	"candles-service/internal/src/infra/database/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type MongoCandleRepository struct {
	collection *mongo.Collection
}

func NewMongoCandleRepository(
	db *mongo.Client,
	dbName string,
) repository.CandleRepository {
	return &MongoCandleRepository{
		collection: db.Database(dbName).Collection("candles"),
	}
}

func (r *MongoCandleRepository) Save(
	ctx context.Context,
	candle *entity.Candle,
) error {
	model := models.FromEntity(candle)
	_, err := r.collection.InsertOne(ctx, model)
	return err
}

func (r *MongoCandleRepository) FindByID(
	ctx context.Context,
	id string,
) (*entity.Candle, error) {
	objectID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid id")
	}

	var result bson.M
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("candle not found")
		}
		return nil, err
	}

	model := &models.CandleModel{
		ID:            objectID.Hex(),
		City:          result["city"].(string),
		CreatedAt:     result["created_at"].(bson.DateTime).Time(),
		ExpiredAt:     result["expired_at"].(bson.DateTime).Time(),
		Intention:     result["intention"].(string),
	}

	if state, ok := result["state"].(string); ok {
		model.State = enums.BrazilState(state)
	}
	if candleType, ok := result["type"].(string); ok {
		model.Type = enums.CandleType(candleType)
	}

	return model.ToEntity(), nil
}

func (r *MongoCandleRepository) FindAll(
	ctx context.Context,
) ([]*entity.Candle, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}

	candles := make([]*entity.Candle, len(results))
	for i, doc := range results {
		model := &models.CandleModel{
			ID:            doc["_id"].(bson.ObjectID).Hex(),
			City:          doc["city"].(string),
			CreatedAt:     doc["created_at"].(bson.DateTime).Time(),
			ExpiredAt:     doc["expired_at"].(bson.DateTime).Time(),
			Intention:     doc["intention"].(string),
		}

		if state, ok := doc["state"].(string); ok {
			model.State = enums.BrazilState(state)
		}
		if candleType, ok := doc["type"].(string); ok {
			model.Type = enums.CandleType(candleType)
		}

		candles[i] = model.ToEntity()
	}

	return candles, nil
}
