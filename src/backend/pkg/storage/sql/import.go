package sql

import (
	"context"
	"github.com/google/uuid"
	"github.com/pixlcrashr/blanner/src/backend/pkg/slices"
)

func (s *Storage) IgnoreImportReference(
	ctx context.Context,
	bookID uuid.UUID,
	provider int,
	reference string,
) error {
	db := s.DB.WithContext(ctx)

	return db.
		Create(&ImportReferenceIgnoredItem{
			BookID:    bookID,
			Provider:  provider,
			Reference: reference,
		}).
		Error
}

func (s *Storage) IgnoredImportReferences(
	ctx context.Context,
	bookID uuid.UUID,
	provider int,
) ([]string, error) {
	db := s.DB.WithContext(ctx)

	var items []ImportReferenceIgnoredItem
	if err := db.
		Where("book_id = ?", bookID).
		Where("provider = ?", provider).
		Find(&items).
		Error; err != nil {
		return nil, err
	}

	return slices.Map(
		items,
		func(i ImportReferenceIgnoredItem) string { return i.Reference },
	), nil
}
