package database

import (
	"context"
	"errors"

	"candles-service/internal/src/domain/candles/entity"
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

func (r *MongoCandleRepository) FindAll(
	ctx context.Context,
) ([]*entity.Candle, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var list []models.CandleModel
	if err := cursor.All(ctx, &list); err != nil {
		return nil, err
	}

	result := make([]*entity.Candle, len(list))
	for i, m := range list {
		result[i] = m.ToEntity()
	}

	return result, nil
}
