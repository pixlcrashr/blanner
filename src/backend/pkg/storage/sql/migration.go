package sql

import (
	"context"
	"gorm.io/gorm"
)

func (s *Storage) Migrate(ctx context.Context) error {
	db := s.DB.WithContext(ctx)

	return db.Transaction(func(tx *gorm.DB) error {
		return db.AutoMigrate(
			&Book{},
			&Period{},
			&Budget{},
			&Account{},
			&BudgetAccountTarget{},
			&Transaction{},
			&ImportReferenceIgnoredItem{},
		)
	})
}
