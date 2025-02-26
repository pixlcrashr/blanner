package sql

import (
	"context"
	"github.com/google/uuid"
	"github.com/pixlcrashr/blanner/src/backend/pkg/optional"
	"github.com/pixlcrashr/blanner/src/backend/pkg/slices"
)

func (s *Storage) Period(ctx context.Context, id uuid.UUID) (*Period, error) {
	db := s.DB.WithContext(ctx)

	var period Period
	if err := db.First(&period, id).Error; err != nil {
		return nil, err
	}

	return &period, nil
}

func (s *Storage) Periods(ctx context.Context, ids []uuid.UUID) ([]*Period, error) {
	db := s.DB.WithContext(ctx)

	var periods []Period
	if err := db.Find(&periods, ids).Error; err != nil {
		return nil, err
	}

	return slices.Map(
		slices.MapByKey(ids, periods, func(b Period) uuid.UUID { return b.ID }),
		func(b Period) *Period { return &b },
	), nil
}

func (s *Storage) SearchPeriods(ctx context.Context, bookID optional.Optional[uuid.UUID]) ([]*Period, error) {
	db := s.DB.WithContext(ctx)

	var periods []*Period

	if bookID.OK() {
		db = db.Where("book_id = ?", bookID.Value())
	}

	if err := db.Find(&periods).Error; err != nil {
		return nil, err
	}

	return periods, nil
}

func (s *Storage) ClosePeriod(
	ctx context.Context,
	id uuid.UUID) error {
	db := s.DB.WithContext(ctx)

	return db.
		Model(&Period{}).
		Where("id = ?", id).
		Update("is_closed", true).
		Error
}
