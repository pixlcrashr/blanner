package sql

import (
	"context"
	"errors"
	"github.com/google/uuid"
	"github.com/pixlcrashr/blanner/src/backend/pkg/optional"
	"github.com/pixlcrashr/blanner/src/backend/pkg/slices"
	"gorm.io/gorm"
)

func (s *Storage) Account(ctx context.Context, id uuid.UUID) (*Account, error) {
	db := s.DB.WithContext(ctx)

	var account Account
	if err := db.First(&account, id).Error; err != nil {
		return nil, err
	}

	return &account, nil
}

func (s *Storage) Accounts(ctx context.Context, ids []uuid.UUID) ([]*Account, error) {
	db := s.DB.WithContext(ctx)

	var accounts []Account
	if err := db.Find(&accounts, ids).Error; err != nil {
		return nil, err
	}

	return slices.Map(
		slices.MapByKey(ids, accounts, func(b Account) uuid.UUID { return b.ID }),
		func(b Account) *Account { return &b },
	), nil
}

func (s *Storage) SearchAccounts(
	ctx context.Context,
	bookID optional.Optional[uuid.UUID],
	parentID optional.Optional[uuid.UUID],
	isGroup optional.Optional[bool],
) ([]*Account, error) {
	db := s.DB.WithContext(ctx)

	var accounts []*Account

	if bookID.OK() {
		db = db.Where("book_id = ?", bookID.Value())
	}

	if parentID.OK() {
		db = db.Where("parent_id = ?", parentID.Value())
	}

	if isGroup.OK() {
		db = db.Where("is_group = ?", isGroup.Value())
	}

	if err := db.
		Find(&accounts).
		Error; err != nil {
		return nil, err
	}

	return accounts, nil
}

func (s *Storage) CreateAccount(
	ctx context.Context,
	bookID uuid.UUID,
	name string,
	description string,
	typ int32,
	code string,
	isGroup bool,
	parentId optional.Optional[uuid.UUID],
) (*Account, error) {
	db := s.DB.WithContext(ctx)

	q := db.
		Where("type = ?", typ).
		Where("code = ?", code)
	if parentId.OK() {
		q = q.Where("parent_id = ?", parentId.Value())
	} else {
		q = q.Where("parent_id IS NULL")
	}

	var accountCount int64
	if err := q.
		Model(&Account{}).
		Count(&accountCount).
		Error; err != nil {
		return nil, err
	}

	if parentId.OK() {
		var m Account
		if err := db.First(&m, parentId.Value()).Error; err != nil {
			return nil, err
		}

		if !m.IsGroup {
			return nil, errors.New("parent account is not a group")
		}

		if m.Type != typ {
			return nil, errors.New("parent account is not of the same type")
		}
	}

	if accountCount > 0 {
		return nil, errors.New("account already exists")
	}

	accountID, err := uuid.NewRandom()
	if err != nil {
		return nil, err
	}

	account := Account{
		BaseModel: BaseModel{
			ID: accountID,
		},
		BookID:      bookID,
		Name:        name,
		Description: description,
		Type:        typ,
		Code:        code,
		IsGroup:     isGroup,
	}

	if parentId.OK() {
		if parentId.Value() == accountID {
			return nil, errors.New("account cannot be its own parent")
		}

		account.ParentID = uuid.NullUUID{
			UUID:  parentId.Value(),
			Valid: true,
		}
	}

	if err := db.Create(&account).Error; err != nil {
		return nil, err
	}

	return &account, nil
}

func (s *Storage) UpdateAccount(
	ctx context.Context,
	id uuid.UUID,
	name optional.Optional[string],
	description optional.Optional[string],
) (*Account, error) {
	db := s.DB.WithContext(ctx)

	var account Account
	if err := db.First(&account, id).Error; err != nil {
		return nil, err
	}

	if name.OK() {
		account.Name = name.Value()
	}

	if description.OK() {
		account.Description = description.Value()
	}

	if err := db.Save(&account).Error; err != nil {
		return nil, err
	}

	return &account, nil
}

func (s *Storage) DeleteAccount(
	ctx context.Context,
	id uuid.UUID,
) error {
	db := s.DB.WithContext(ctx)

	return db.Transaction(func(tx *gorm.DB) error {
		var transactions []Transaction
		if err := db.Where("account_id = ?", id).Find(&transactions).Error; err != nil {
			return err
		}

		var budgetAccountTargets []BudgetAccountTarget
		if err := db.Where("account_id = ?", id).Find(&budgetAccountTargets).Error; err != nil {
			return err
		}

		db = db.Unscoped()
		if len(transactions) > 0 {
			if err := db.Delete(&transactions).Error; err != nil {
				return err
			}
		}

		if len(budgetAccountTargets) > 0 {
			if err := db.Delete(&budgetAccountTargets).Error; err != nil {
				return err
			}
		}

		if err := db.Delete(&Account{}, id).Error; err != nil {
			return err
		}

		return nil
	})
}

type accountCode struct {
	ID       uuid.UUID     `gorm:"id"`
	ParentID uuid.NullUUID `gorm:"parent_id"`
	Code     string        `gorm:"code"`
}

func (s *Storage) AccountFullCodes(
	ctx context.Context,
	bookID uuid.UUID,
) (map[uuid.UUID][]string, error) {
	db := s.DB.WithContext(ctx)

	var ms []accountCode
	if err := db.Model(&Account{}).Where("book_id = ?", bookID).Find(&ms).Error; err != nil {
		return nil, err
	}

	aM := make(map[uuid.UUID]*accountCode)

	for _, m := range ms {
		aM[m.ID] = &m
	}

	res := make(map[uuid.UUID][]string, len(ms))
	for _, v := range ms {
		res[v.ID] = recurseAccountFullCode(aM, &v)
	}

	return res, nil
}

func (s *Storage) AccountDepths(
	ctx context.Context,
	bookID uuid.UUID,
) (map[uuid.UUID]int, error) {
	db := s.DB.WithContext(ctx)

	var as []*Account
	if err := db.
		Find(&as, "book_id = ?", bookID).
		Error; err != nil {
		return nil, err
	}

	return accountDepths(as), nil
}

func accountDepths(as []*Account) map[uuid.UUID]int {
	aM := make(map[uuid.UUID]*Account)
	for _, a := range as {
		aM[a.ID] = a
	}

	m := make(map[uuid.UUID]int)
	for _, a := range as {
		m[a.ID] = recurseAccountDepths(aM, a.ID, 0)
	}

	return m
}

func recurseAccountDepths(aM map[uuid.UUID]*Account, accountID uuid.UUID, depth int) int {
	a, ok := aM[accountID]
	if !ok {
		return depth
	}

	return recurseAccountDepths(aM, a.ParentID.UUID, depth+1)
}

func recurseAccountFullCode(
	accountMap map[uuid.UUID]*accountCode,
	account *accountCode,
) []string {
	var codes []string
	codes = append(codes, account.Code)

	if !account.ParentID.Valid {
		return codes
	}

	p, ok := accountMap[account.ParentID.UUID]
	if !ok {
		return codes
	}

	return append(recurseAccountFullCode(accountMap, p), codes...)
}
