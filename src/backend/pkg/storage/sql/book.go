package sql

import (
	"context"
	"github.com/google/uuid"
	"github.com/pixlcrashr/blanner/src/backend/pkg/optional"
	"github.com/pixlcrashr/blanner/src/backend/pkg/slices"
	"gorm.io/gorm"
)

func (s *Storage) Book(ctx context.Context, id uuid.UUID) (*Book, error) {
	db := s.DB.WithContext(ctx)

	var book Book
	if err := db.First(&book, id).Error; err != nil {
		return nil, err
	}

	return &book, nil
}

func (s *Storage) Books(ctx context.Context, ids []uuid.UUID) ([]*Book, error) {
	db := s.DB.WithContext(ctx)

	var books []Book
	if err := db.Find(&books, ids).Error; err != nil {
		return nil, err
	}

	return slices.Map(
		slices.MapByKey(ids, books, func(b Book) uuid.UUID { return b.ID }),
		func(b Book) *Book { return &b },
	), nil
}

func (s *Storage) SearchBooks(ctx context.Context) ([]*Book, error) {
	db := s.DB.WithContext(ctx)

	var books []*Book
	if err := db.Find(&books).Error; err != nil {
		return nil, err
	}

	return books, nil
}

func (s *Storage) CreateBook(
	ctx context.Context,
	name string,
	description string,
	currency string,
	startMonth int32,
) (*Book, error) {
	db := s.DB.WithContext(ctx)

	book := Book{
		Name:        name,
		Description: description,
		Currency:    currency,
		StartMonth:  startMonth,
	}
	if err := db.Create(&book).Error; err != nil {
		return nil, err
	}

	return &book, nil
}

func (s *Storage) UpdateBook(
	ctx context.Context,
	id uuid.UUID,
	name optional.Optional[string],
	description optional.Optional[string],
) (*Book, error) {
	db := s.DB.WithContext(ctx)

	var book Book
	if err := db.First(&book, id).Error; err != nil {
		return nil, err
	}

	if name.OK() {
		book.Name = name.Value()
	}

	if description.OK() {
		book.Description = description.Value()
	}

	if err := db.Save(&book).Error; err != nil {
		return nil, err
	}

	return &book, nil
}

func (s *Storage) DeleteBook(
	ctx context.Context,
	id uuid.UUID,
) error {
	db := s.DB.WithContext(ctx)

	return db.Transaction(func(tx *gorm.DB) error {
		var book Book
		if err := db.First(&book, id).Error; err != nil {
			return err
		}

		var accounts []Account
		if err := db.
			Where("book_id = ?", id).
			Find(&accounts).Error; err != nil {
			return err
		}

		var transactions []Transaction
		if err := db.
			Where("account_id in (?)", slices.Map(accounts, func(a Account) uuid.UUID { return a.ID })).
			Find(&transactions).
			Error; err != nil {
			return err
		}

		var periods []Period
		if err := db.
			Where("book_id = ?", id).
			Find(&periods).
			Error; err != nil {
			return err
		}

		var budgets []Budget
		if err := db.
			Where("period_id in (?)", slices.Map(periods, func(p Period) uuid.UUID { return p.ID })).
			Find(&budgets).
			Error; err != nil {
			return err
		}

		var budgetAccountTargets []BudgetAccountTarget
		if err := db.
			Where("budget_id in (?)", slices.Map(budgets, func(b Budget) uuid.UUID { return b.ID })).
			Find(&budgetAccountTargets).
			Error; err != nil {
			return err
		}

		db = db.Unscoped()
		if len(transactions) > 0 {
			if err := db.Delete(&transactions).Error; err != nil {
				return err
			}
		}

		if len(accounts) > 0 {
			if err := db.Delete(&accounts).Error; err != nil {
				return err
			}
		}

		if len(budgetAccountTargets) > 0 {
			if err := db.Delete(&budgetAccountTargets).Error; err != nil {
				return err
			}
		}

		if len(budgets) > 0 {
			if err := db.Delete(&budgets).Error; err != nil {
				return err
			}
		}

		if len(periods) > 0 {
			if err := db.Delete(&periods).Error; err != nil {
				return err
			}
		}

		if err := db.Delete(&book).Error; err != nil {
			return err
		}

		return nil
	})
}
