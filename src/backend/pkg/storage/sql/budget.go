package sql

import (
	"context"
	"errors"
	"github.com/google/uuid"
	"github.com/pixlcrashr/blanner/src/backend/pkg/optional"
	"github.com/pixlcrashr/blanner/src/backend/pkg/slices"
	"gorm.io/gorm"
	slices2 "slices"
	"time"
)

func (s *Storage) Budget(ctx context.Context, id uuid.UUID) (*Budget, error) {
	db := s.DB.WithContext(ctx)

	var budget Budget
	if err := db.First(&budget, id).Error; err != nil {
		return nil, err
	}

	return &budget, nil
}

func (s *Storage) Budgets(ctx context.Context, ids []uuid.UUID) ([]*Budget, error) {
	db := s.DB.WithContext(ctx)

	var budgets []Budget
	if err := db.Find(&budgets, ids).Error; err != nil {
		return nil, err
	}

	return slices.Map(
		slices.MapByKey(ids, budgets, func(b Budget) uuid.UUID { return b.ID }),
		func(b Budget) *Budget { return &b },
	), nil
}

func (s *Storage) SearchBudgets(ctx context.Context, periodID optional.Optional[uuid.UUID], bookID optional.Optional[uuid.UUID]) ([]*Budget, error) {
	db := s.DB.WithContext(ctx)

	query := `SELECT
	budgets.*
FROM
	budgets,
	periods
WHERE
	periods.id = budgets.period_id`
	args := []interface{}{}

	if periodID.OK() {
		query += ` AND periods.id = ?`
		args = append(args, periodID.Value())
	}

	if bookID.OK() {
		query += ` AND periods.book_id = ?`
		args = append(args, bookID.Value())
	}

	var budgets []*Budget
	if err := db.Raw(query, args...).Find(&budgets).Error; err != nil {
		return nil, err
	}

	return budgets, nil
}

func (s *Storage) CreateBudget(
	ctx context.Context,
	bookID uuid.UUID,
	name string,
	description string,
	year int32,
) (*Budget, error) {
	db := s.DB.WithContext(ctx)

	var period Period
	if err := db.Where("year = ?", year).Assign(&Period{
		BookID:   bookID,
		Year:     year,
		IsClosed: false,
	}).FirstOrCreate(&period).Error; err != nil {
		return nil, err
	}

	budget := Budget{
		Name:        name,
		Description: description,
		PeriodID:    period.ID,
	}
	if err := db.Create(&budget).Error; err != nil {
		return nil, err
	}

	return &budget, nil
}

func (s *Storage) UpdateBudget(
	ctx context.Context,
	id uuid.UUID,
	name optional.Optional[string],
	description optional.Optional[string],
) (*Budget, error) {
	db := s.DB.WithContext(ctx)

	var budget Budget
	if err := db.First(&budget, id).Error; err != nil {
		return nil, err
	}

	if name.OK() {
		budget.Name = name.Value()
	}

	if description.OK() {
		budget.Description = description.Value()
	}

	if err := db.Save(&budget).Error; err != nil {
		return nil, err
	}

	return &budget, nil
}

func (s *Storage) DeleteBudget(
	ctx context.Context,
	id uuid.UUID,
) error {
	db := s.DB.WithContext(ctx)

	return db.Transaction(func(tx *gorm.DB) error {
		var budget Budget
		if err := db.First(&budget, id).Error; err != nil {
			return err
		}

		var budgetTargetValues []BudgetAccountTarget
		if err := db.
			Where("budget_id = ?", id).
			Find(&budgetTargetValues).Error; err != nil {
			return err
		}

		if len(budgetTargetValues) > 0 {
			if err := db.Delete(&budgetTargetValues).Error; err != nil {
				return err
			}
		}

		if err := db.Delete(&budget).Error; err != nil {
			return err
		}

		return nil
	})
}

func (s *Storage) SetBudgetAccountTarget(
	ctx context.Context,
	id uuid.UUID,
	accountID uuid.UUID,
	value int64,
) error {
	db := s.DB.WithContext(ctx)

	var m Account
	if err := db.First(&m, accountID).Error; err != nil {
		return err
	}
	if m.IsGroup {
		return errors.New("cannot set plan value for a group account")
	}

	var tM BudgetAccountTarget
	if err := db.
		Where("budget_id = ?", id).
		Where("account_id = ?", accountID).
		Assign(&BudgetAccountTarget{
			BudgetID:  id,
			AccountID: accountID,
		}).
		FirstOrCreate(&tM).
		Error; err != nil {
		return err
	}

	tM.Value = value

	if err := db.Save(&tM).Error; err != nil {
		return err
	}

	return nil
}

func (s *Storage) DeleteBudgetAccountTarget(
	ctx context.Context,
	id uuid.UUID,
	accountID uuid.UUID,
) error {
	db := s.DB.WithContext(ctx)

	if err := db.
		Unscoped().
		Where("budget_id = ?", id).
		Where("account_id = ?", accountID).
		Delete(&BudgetAccountTarget{}).
		Error; err != nil {
		return err
	}

	return nil
}

type BudgetAccountActualValue struct {
	AccountID uuid.UUID
	BudgetID  uuid.UUID
	Value     int64
}

func (s *Storage) BudgetAccountActualValue(
	ctx context.Context,
	accountID uuid.UUID,
	budgetID uuid.UUID,
) (*BudgetAccountActualValue, error) {
	db := s.DB.WithContext(ctx)

	var budget Budget
	if err := db.
		Preload("Period").
		Preload("Period.Book").
		First(&budget, budgetID).
		Error; err != nil {
		return nil, err
	}

	afterDate := time.Date(int(budget.Period.Year), time.Month(budget.Period.Book.StartMonth), 1, 0, 0, 0, 0, time.UTC)
	beforeDate := time.Date(int(budget.Period.Year+1), time.Month(budget.Period.Book.StartMonth), 1, 0, 0, 0, 0, time.UTC)

	var value struct {
		Value int64 `gorm:"column:value"`
	}

	if err := db.Raw(`SELECT
	COALESCE(SUM(value), 0) AS value
FROM
	transactions
WHERE
    account_id = ? AND
	booked_at >= ? AND
    booked_at < ?`,
		accountID,
		afterDate,
		beforeDate,
	).
		First(&value).
		Error; err != nil {
		return nil, err
	}

	return &BudgetAccountActualValue{
		AccountID: accountID,
		BudgetID:  budgetID,
		Value:     value.Value,
	}, nil
}

type AccountBudgetValue struct {
	AccountID       uuid.UUID `gorm:"account_id"`
	BudgetID        uuid.UUID `gorm:"budget_id"`
	ActualValue     int64     `gorm:"actual_value"`
	TargetValue     int64     `gorm:"target_value"`
	DifferenceValue int64     `gorm:"difference_value"`
}

func (s *Storage) AccountBudgetValues(
	ctx context.Context,
	accountID uuid.UUID,
) ([]*AccountBudgetValue, error) {
	db := s.DB.WithContext(ctx)

	var tMs []struct {
		AccountID uuid.UUID `gorm:"column:account_id"`
		BudgetID  uuid.UUID `gorm:"column:budget_id"`
		Value     int64     `gorm:"column:value"`
	}
	query := `SELECT
    budget_account_targets.account_id AS account_id,
    budget_account_targets.budget_id AS budget_id,
    budget_account_targets.value AS value
FROM
    budgets,
    budget_account_targets,
    periods,
    books
WHERE
    budget_account_targets.account_id = ? AND
    budgets.id = budget_account_targets.budget_id
GROUP BY
    budget_account_targets.account_id,
    budget_account_targets.budget_id`
	if err := db.Raw(query, accountID).Find(&tMs).Error; err != nil {
		return nil, err
	}

	var aMs []struct {
		BudgetID uuid.UUID `gorm:"column:budget_id"`
		ActualID uuid.UUID `gorm:"column:actual_id"`
		Value    int64     `gorm:"column:value"`
	}
	query = `SELECT
    budgets.id AS budget_id,
    accounts.id AS account_id,
    SUM(transactions.value) AS value
FROM
    transactions,
    accounts,
    budgets,
    periods,
    books
WHERE
    accounts.id = ? AND
    periods.id = budgets.period_id AND
    periods.book_id = accounts.book_id AND
    books.id = periods.book_id AND
    transactions.account_id = accounts.id AND
    transactions.booked_at >= date(year || '-' || books.start_month || '-01') AND
    transactions.booked_at < date((year+1) || '-' || books.start_month || '-01')
GROUP BY
    budgets.id,
    accounts.id`
	if err := db.Raw(query, accountID).Find(&aMs).Error; err != nil {
		return nil, err
	}

	var bMs []Budget
	if err := db.Find(&bMs).Error; err != nil {
		return nil, err
	}

	var res []*AccountBudgetValue
	for _, bM := range bMs {
		tIdx := slices2.IndexFunc(tMs, func(tM struct {
			AccountID uuid.UUID `gorm:"column:account_id"`
			BudgetID  uuid.UUID `gorm:"column:budget_id"`
			Value     int64     `gorm:"column:value"`
		}) bool {
			return tM.BudgetID == bM.ID
		})
		aIdx := slices2.IndexFunc(aMs, func(aM struct {
			BudgetID uuid.UUID `gorm:"column:budget_id"`
			ActualID uuid.UUID `gorm:"column:actual_id"`
			Value    int64     `gorm:"column:value"`
		}) bool {
			return aM.BudgetID == bM.ID
		})

		var t int64 = 0
		if tIdx > -1 {
			t = tMs[tIdx].Value
		}

		var a int64 = 0
		if aIdx > -1 {
			a = aMs[aIdx].Value
		}

		res = append(res, &AccountBudgetValue{
			AccountID:       accountID,
			BudgetID:        bM.ID,
			TargetValue:     t,
			ActualValue:     a,
			DifferenceValue: t - a,
		})
	}

	return res, nil
}

func (s *Storage) BudgetActualValues(
	ctx context.Context,
	budgetID uuid.UUID,
) ([]*BudgetAccountActualValue, error) {
	db := s.DB.WithContext(ctx)

	var budget Budget
	if err := db.
		Preload("Period").
		Preload("Period.Book").
		First(&budget, budgetID).
		Error; err != nil {
		return nil, err
	}

	afterDate := time.Date(int(budget.Period.Year), time.Month(budget.Period.Book.StartMonth), 1, 0, 0, 0, 0, time.UTC)
	beforeDate := time.Date(int(budget.Period.Year+1), time.Month(budget.Period.Book.StartMonth), 1, 0, 0, 0, 0, time.UTC)

	var values []struct {
		AccountID uuid.UUID `gorm:"column:account_id"`
		Value     int64     `gorm:"column:value"`
	}

	if err := db.Raw(`SELECT
    account_id,
	COALESCE(SUM(value), 0) AS value
FROM
	transactions
WHERE
	booked_at >= ? AND
    booked_at < ?
GROUP BY account_id`,
		afterDate,
		beforeDate,
	).
		Find(&values).
		Error; err != nil {
		return nil, err
	}

	return slices.Map(values, func(v struct {
		AccountID uuid.UUID `gorm:"column:account_id"`
		Value     int64     `gorm:"column:value"`
	}) *BudgetAccountActualValue {
		return &BudgetAccountActualValue{
			AccountID: v.AccountID,
			BudgetID:  budgetID,
			Value:     v.Value,
		}
	}), nil
}

func (s *Storage) BudgetAccountTargets(
	ctx context.Context,
	budgetID uuid.UUID,
) ([]*BudgetAccountTarget, error) {
	db := s.DB.WithContext(ctx)

	var targets []*BudgetAccountTarget
	if err := db.
		Where("budget_id = ?", budgetID).
		Find(&targets).
		Error; err != nil {
		return nil, err
	}

	return targets, nil
}
