package sql

import (
	"github.com/google/uuid"
	"github.com/pixlcrashr/blanner/src/backend/pkg/slices"
)

func (s *Storage) Book(id uuid.UUID) (*Book, error) {
	var book Book
	if err := s.DB.Find(&book, id).Error; err != nil {
		return nil, err
	}

	return &book, nil
}

func (s *Storage) Books(ids []uuid.UUID) ([]*Book, error) {
	var books []Book
	if err := s.DB.Where("id in (?)", ids).Find(&books).Error; err != nil {
		return nil, err
	}

	return slices.Map(
		slices.MapByKey(ids, books, func(b Book) uuid.UUID { return b.ID }),
		func(b Book) *Book { return &b },
	), nil
}
