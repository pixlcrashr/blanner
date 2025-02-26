package sql

import (
	"context"
	"github.com/google/uuid"
	"github.com/maruel/natural"
	"github.com/pixlcrashr/blanner/src/backend/pkg/optional"
	"github.com/pixlcrashr/blanner/src/backend/pkg/slices"
	"gorm.io/gorm"
	slices2 "slices"
)

type MatrixValue struct {
	Target     int64
	Actual     int64
	Difference int64
}

type MatrixAccountNode struct {
	AccountID   uuid.UUID
	ParentIndex optional.Optional[int]
	Depth       int
}

type Matrix struct {
	AccountNodes []MatrixAccountNode
	BudgetIDs    []uuid.UUID
	Values       [][]MatrixValue
	MaxDepth     int
}

func (s *Storage) Matrix(
	ctx context.Context,
	bookID uuid.UUID,
	ignoreBudgetIDs optional.Optional[[]uuid.UUID],
) (*Matrix, error) {
	db := s.DB.WithContext(ctx)

	var accounts []Account
	if err := db.
		Where("book_id = ?", bookID).
		Find(&accounts).
		Error; err != nil {
		return nil, err
	}

	var budgets []Budget
	q := db.
		Select("budgets.id").
		Joins("LEFT JOIN periods ON periods.id = budgets.period_id").
		Where("periods.book_id = ?", bookID)

	if ignoreBudgetIDs.OK() {
		q = q.
			Where("budgets.id NOT IN (?)", ignoreBudgetIDs.Value())
	}

	if err := q.
		Find(&budgets).
		Error; err != nil {
		return nil, err
	}

	dM := make(map[uuid.UUID]int)
	accounts = sortAccountsHierarchically(accounts, dM)

	tVM, err := targetValuesMap(
		db,
		bookID,
		ignoreBudgetIDs,
	)
	if err != nil {
		return nil, err
	}

	aVM, err := actualValuesMap(
		db,
		bookID,
		ignoreBudgetIDs,
	)
	if err != nil {
		return nil, err
	}

	aM := make(map[uuid.UUID]Account)
	for _, a := range accounts {
		aM[a.ID] = a
	}

	for _, a := range accounts {
		if a.IsGroup {
			continue
		}

		for _, b := range budgets {
			recurseAccountBudgetValues(
				aM,
				tVM,
				aVM,
				b.ID,
				a.ID,
				tVM[accountBudgetValueKey{AccountID: a.ID, BudgetID: b.ID}],
				aVM[accountBudgetValueKey{AccountID: a.ID, BudgetID: b.ID}],
			)
		}
	}

	var values [][]MatrixValue
	for _, a := range accounts {
		var aR []MatrixValue

		for _, b := range budgets {
			_t := tVM[accountBudgetValueKey{AccountID: a.ID, BudgetID: b.ID}]
			_a := aVM[accountBudgetValueKey{AccountID: a.ID, BudgetID: b.ID}]

			aR = append(aR, MatrixValue{
				Target:     _t,
				Actual:     _a,
				Difference: _t - _a,
			})
		}

		values = append(values, aR)
	}

	var maxDepth int
	for _, d := range dM {
		if d <= maxDepth {
			continue
		}

		maxDepth = d
	}

	return &Matrix{
		AccountNodes: slices.Map(accounts, func(a Account) MatrixAccountNode {
			var p optional.Optional[int]
			if a.ParentID.Valid {
				pIdx := slices2.IndexFunc(accounts, func(b Account) bool { return b.ID == a.ParentID.UUID })
				if pIdx >= 0 {
					p = optional.From(pIdx)
				}
			}

			return MatrixAccountNode{
				AccountID:   a.ID,
				ParentIndex: p,
				Depth:       dM[a.ID],
			}
		}),
		BudgetIDs: slices.Map(budgets, func(b Budget) uuid.UUID { return b.ID }),
		Values:    values,
		MaxDepth:  maxDepth,
	}, nil
}

func recurseAccountBudgetValues(
	aM map[uuid.UUID]Account,
	tVM map[accountBudgetValueKey]int64,
	aVM map[accountBudgetValueKey]int64,
	budgetID uuid.UUID,
	aID uuid.UUID,
	tV int64,
	aV int64,
) {
	a, ok := aM[aID]
	if !ok {
		return
	}

	pA, ok := aM[a.ParentID.UUID]
	if !ok {
		return
	}

	tVM[accountBudgetValueKey{
		AccountID: a.ParentID.UUID,
		BudgetID:  budgetID,
	}] += tV
	aVM[accountBudgetValueKey{
		AccountID: a.ParentID.UUID,
		BudgetID:  budgetID,
	}] += aV

	recurseAccountBudgetValues(
		aM,
		tVM,
		aVM,
		budgetID,
		pA.ID,
		tV,
		aV,
	)
}

type accountBudgetValueKey struct {
	AccountID uuid.UUID
	BudgetID  uuid.UUID
}

func targetValuesMap(
	db *gorm.DB,
	bookID uuid.UUID,
	ignoreBudgetIDs optional.Optional[[]uuid.UUID],
) (map[accountBudgetValueKey]int64, error) {
	type _targetValue struct {
		AccountID uuid.UUID `gorm:"account_id"`
		BudgetID  uuid.UUID `gorm:"budget_id"`
		Value     int64     `gorm:"value"`
	}

	var tVs []_targetValue
	q := db.
		Model(&BudgetAccountTarget{}).
		Select("budget_account_targets.account_id", "budget_account_targets.budget_id", "budget_account_targets.value").
		Joins("LEFT JOIN accounts ON accounts.id = budget_account_targets.account_id").
		Where("accounts.book_id = ?", bookID)

	if ignoreBudgetIDs.OK() {
		q = q.
			Where("budget_account_targets.budget_id NOT IN (?)", ignoreBudgetIDs.Value())
	}

	if err := q.
		Find(&tVs).
		Error; err != nil {
		return nil, err
	}

	tVM := make(map[accountBudgetValueKey]int64)

	for _, v := range tVs {
		tVM[accountBudgetValueKey{AccountID: v.AccountID, BudgetID: v.BudgetID}] = v.Value
	}
	return tVM, nil
}

func actualValuesMap(
	db *gorm.DB,
	bookID uuid.UUID,
	ignoreBudgetIDs optional.Optional[[]uuid.UUID],
) (map[accountBudgetValueKey]int64, error) {
	type _actualValue struct {
		AccountID uuid.UUID `gorm:"account_id"`
		BudgetID  uuid.UUID `gorm:"budget_id"`
		Value     int64     `gorm:"value"`
	}

	q := db.
		Model(&Budget{}).
		Select("budgets.id AS budget_id", "accounts.id AS account_id", "SUM(transactions.value) AS value").
		Joins("LEFT JOIN periods ON periods.id = budgets.period_id").
		Joins("LEFT JOIN accounts ON accounts.book_id = periods.book_id").
		Joins("LEFT JOIN books ON books.id = periods.book_id").
		Joins("LEFT JOIN transactions ON transactions.account_id = accounts.id").
		Where("books.id = ?", bookID).
		Where("accounts.is_group = false").
		Where("transactions.booked_at >= date(periods.year || '-' || books.start_month || '-01')").
		Where("transactions.booked_at < date((periods.year+1) || '-' || books.start_month || '-01')")

	if ignoreBudgetIDs.OK() {
		q = q.
			Where("budgets.id NOT IN (?)", ignoreBudgetIDs.Value())
	}

	var aVs []_actualValue = nil
	if err := q.
		Group("budgets.id, accounts.id").
		Find(&aVs).
		Error; err != nil {
		return nil, err
	}

	aVM := make(map[accountBudgetValueKey]int64)

	for _, aV := range aVs {
		aVM[accountBudgetValueKey{
			AccountID: aV.AccountID,
			BudgetID:  aV.BudgetID,
		}] = aV.Value
	}

	return aVM, nil
}

func sortAccountsHierarchically(
	as []Account,
	dM map[uuid.UUID]int,
) []Account {
	newAs := make([]Account, len(as))

	appendAccountChildren(
		as,
		dM,
		uuid.NullUUID{},
		newAs,
		0,
		1,
	)

	return newAs
}

func appendAccountChildren(
	as []Account,
	dM map[uuid.UUID]int,
	pA uuid.NullUUID,
	newAs []Account,
	i int,
	depth int,
) int {
	tmpAs := make([]Account, 0)
	for _, a := range as {
		if a.ParentID != pA {
			continue
		}

		tmpAs = append(tmpAs, a)
	}

	if len(tmpAs) == 0 {
		return i
	}

	slices2.SortFunc(tmpAs, func(a, b Account) int {
		if a.Type != b.Type {
			return int(a.Type - b.Type)
		}

		if !natural.Less(a.Code, b.Code) {
			return 1
		}

		return -1
	})

	for _, a := range tmpAs {
		newAs[i] = a
		dM[a.ID] = depth
		i = appendAccountChildren(
			as,
			dM,
			uuid.NullUUID{UUID: a.ID, Valid: true},
			newAs,
			i+1,
			depth+1,
		)
	}

	return i
}
