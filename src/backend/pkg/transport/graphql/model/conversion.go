package model

import (
	"github.com/pixlcrashr/blanner/src/backend/pkg/slices"
	"github.com/pixlcrashr/blanner/src/backend/pkg/storage/sql"
)

func FromAccountType(v int32) AccountType {
	switch v {
	default:
		return AccountTypeIncome
	case 0:
		return AccountTypeIncome
	case 1:
		return AccountTypeExpense
	}
}

func ToAccountType(v AccountType) int32 {
	switch v {
	default:
		return 0
	case AccountTypeIncome:
		return 0
	case AccountTypeExpense:
		return 1
	}
}

func ToImportProvider(v int32) ImportProvider {
	switch v {
	default:
		return ImportProviderLexware
	case 0:
		return ImportProviderLexware
	}
}

func FromAccount(m *sql.Account) *Account {
	var a Account

	if m == nil {
		return nil
	}

	a.ID = m.ID
	a.BookID = m.BookID
	a.Name = m.Name
	a.Description = m.Description
	a.Type = FromAccountType(m.Type)

	if m.ParentID.Valid {
		a.ParentID = &m.ParentID.UUID
	}

	a.Code = m.Code
	a.CreatedAt = m.CreatedAt
	a.UpdatedAt = m.UpdatedAt
	a.IsGroup = m.IsGroup

	return &a
}

func FromAccounts(ms []*sql.Account) []*Account {
	return slices.Map(ms, FromAccount)
}

func FromBook(m *sql.Book) *Book {
	var b Book

	if m == nil {
		return nil
	}

	b.ID = m.ID
	b.Name = m.Name
	b.Description = m.Description
	b.Currency = m.Currency
	b.StartMonth = int(m.StartMonth)
	b.CreatedAt = m.CreatedAt
	b.UpdatedAt = m.UpdatedAt

	return &b
}

func FromBooks(ms []*sql.Book) []*Book {
	return slices.Map(ms, FromBook)
}

func FromBudget(m *sql.Budget) *Budget {
	var b Budget

	if m == nil {
		return nil
	}

	b.ID = m.ID
	b.Name = m.Name
	b.Description = m.Description
	b.PeriodID = m.PeriodID
	b.CreatedAt = m.CreatedAt
	b.UpdatedAt = m.UpdatedAt

	return &b
}

func FromBudgets(ms []*sql.Budget) []*Budget {
	return slices.Map(ms, FromBudget)
}

func FromPeriod(m *sql.Period) *Period {
	var p Period

	if m == nil {
		return nil
	}

	p.ID = m.ID
	p.BookID = m.BookID
	p.Year = int(m.Year)
	p.IsClosed = m.IsClosed
	p.CreatedAt = m.CreatedAt
	p.UpdatedAt = m.UpdatedAt

	return &p
}

func FromPeriods(ms []*sql.Period) []*Period {
	return slices.Map(ms, FromPeriod)
}

func FromTransaction(m *sql.Transaction) *Transaction {
	var t Transaction

	if m == nil {
		return nil
	}

	t.ID = m.ID
	t.AccountID = m.AccountID
	t.Value = &Money{
		MinUnit: m.Value,
	}
	t.Reference = m.Reference
	t.Description = m.Description
	t.BookedAt = m.BookedAt
	t.CreatedAt = m.CreatedAt
	t.UpdatedAt = m.UpdatedAt
	if m.ImportProvider.Valid {
		tmp := ToImportProvider(m.ImportProvider.Int32)
		t.ImportProvider = &tmp
	}
	if m.ImportReference.Valid {
		t.ImportReference = &m.ImportReference.String
	}

	return &t
}

func FromTransactions(ms []*sql.Transaction) []*Transaction {
	return slices.Map(ms, FromTransaction)
}

func FromBudgetAccountTarget(m *sql.BudgetAccountTarget) *BudgetAccountTarget {
	var b BudgetAccountTarget

	if m == nil {
		return nil
	}

	b.ID = m.ID
	b.BudgetID = m.BudgetID
	b.AccountID = m.AccountID
	b.Value = &Money{
		MinUnit: m.Value,
	}
	b.CreatedAt = m.CreatedAt
	b.UpdatedAt = m.UpdatedAt

	return &b
}

func FromBudgetAccountTargets(ms []*sql.BudgetAccountTarget) []*BudgetAccountTarget {
	return slices.Map(ms, FromBudgetAccountTarget)
}

func FromBudgetAccountActual(m *sql.BudgetAccountActualValue) *BudgetAccountActual {
	var b BudgetAccountActual

	if m == nil {
		return nil
	}

	b.BudgetID = m.BudgetID
	b.AccountID = m.AccountID
	b.Value = &Money{
		MinUnit: m.Value,
	}

	return &b
}

func FromBudgetAccountActuals(ms []*sql.BudgetAccountActualValue) []*BudgetAccountActual {
	return slices.Map(ms, FromBudgetAccountActual)
}

func FromAccountBudgetValue(m *sql.AccountBudgetValue) *AccountBudgetValue {
	return &AccountBudgetValue{
		BudgetID:   m.BudgetID,
		Target:     &Money{MinUnit: m.TargetValue},
		Actual:     &Money{MinUnit: m.ActualValue},
		Difference: &Money{MinUnit: m.DifferenceValue},
	}
}

func FromAccountBudgetValues(ms []*sql.AccountBudgetValue) []*AccountBudgetValue {
	return slices.Map(ms, FromAccountBudgetValue)
}

func FromImportProvider(p ImportProvider) int32 {
	switch p {
	default:
		return 0
	case ImportProviderLexware:
		return 0
	}
}

func FromNilImportProvider(p *ImportProvider) (res *int32) {
	if p == nil {
		return
	}

	switch *p {
	default:
	case ImportProviderLexware:
		res = new(int32)
		*res = 0
		break
	}

	return
}
