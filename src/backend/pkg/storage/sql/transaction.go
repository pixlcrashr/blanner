package sql

import (
	"context"
	"database/sql"
	"errors"
	"github.com/google/uuid"
	"github.com/pixlcrashr/blanner/src/backend/pkg/optional"
	"github.com/pixlcrashr/blanner/src/backend/pkg/slices"
	"time"
)

func (s *Storage) Transaction(ctx context.Context, id uuid.UUID) (*Transaction, error) {
	db := s.DB.WithContext(ctx)

	var transaction Transaction
	if err := db.First(&transaction, id).Error; err != nil {
		return nil, err
	}

	return &transaction, nil
}

func (s *Storage) Transactions(ctx context.Context, ids []uuid.UUID) ([]*Transaction, error) {
	db := s.DB.WithContext(ctx)

	var transactions []Transaction
	if err := db.Find(&transactions, ids).Error; err != nil {
		return nil, err
	}

	return slices.Map(
		slices.MapByKey(ids, transactions, func(b Transaction) uuid.UUID { return b.ID }),
		func(b Transaction) *Transaction { return &b },
	), nil
}

func (s *Storage) SearchTransactions(
	ctx context.Context,
	accountID optional.Optional[uuid.UUID],
	bookID optional.Optional[uuid.UUID],
) ([]*Transaction, error) {
	db := s.DB.WithContext(ctx)

	query := `SELECT
transactions.*
FROM
    transactions,
    accounts
WHERE
	accounts.id = transactions.account_id`
	args := []interface{}{}

	if bookID.OK() {
		query += ` AND accounts.book_id = ?`
		args = append(args, bookID.Value())
	}

	if accountID.OK() {
		query += ` AND transactions.account_id = ?`
		args = append(args, accountID.Value())
	}

	query += ` ORDER BY transactions.booked_at DESC`

	var transactions []*Transaction
	if err := db.Raw(query, args...).Find(&transactions).Error; err != nil {
		return nil, err
	}

	return transactions, nil
}

func (s *Storage) CreateTransaction(
	ctx context.Context,
	accountID uuid.UUID,
	value int64,
	description string,
	reference string,
	bookedAt time.Time,
	importProvider optional.Optional[int32],
	importReference optional.Optional[string],
) (*Transaction, error) {
	db := s.DB.WithContext(ctx)

	var m Account
	if err := db.First(&m, accountID).Error; err != nil {
		return nil, err
	}

	if m.IsGroup {
		return nil, errors.New("cannot create a transaction for a group account")
	}

	transaction := Transaction{
		AccountID:   accountID,
		Value:       value,
		Description: description,
		BookedAt:    bookedAt,
		Reference:   reference,
	}
	if importProvider.OK() {
		transaction.ImportProvider = sql.NullInt32{
			Int32: importProvider.Value(),
			Valid: true,
		}
	}
	if importReference.OK() {
		transaction.ImportReference = sql.NullString{
			String: importReference.Value(),
			Valid:  true,
		}
	}
	if err := db.Create(&transaction).Error; err != nil {
		return nil, err
	}

	return &transaction, nil
}

func (s *Storage) UpdateTransaction(
	ctx context.Context,
	id uuid.UUID,
	accountID optional.Optional[uuid.UUID],
) (*Transaction, error) {
	db := s.DB.WithContext(ctx)

	var m Transaction
	if err := db.First(&m, id).Error; err != nil {
		return nil, err
	}

	if accountID.OK() {
		m.AccountID = accountID.Value()
	}

	if err := db.Save(&m).Error; err != nil {
		return nil, err
	}

	return &m, nil
}

func (s *Storage) DeleteTransaction(
	ctx context.Context,
	id uuid.UUID,
) error {
	db := s.DB.WithContext(ctx)

	return db.Unscoped().Delete(&Transaction{}, id).Error
}
