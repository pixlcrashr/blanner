package sql

import (
	"database/sql"
	"gorm.io/gorm"
	"time"

	"github.com/google/uuid"
)

type BaseModel struct {
	ID        uuid.UUID `gorm:"column:id;type:uuid;primaryKey"`
	CreatedAt time.Time `gorm:"column:created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at"`
	DeletedAt time.Time `gorm:"column:deleted_at"`
}

func (m *BaseModel) BeforeCreate(_ *gorm.DB) error {
	m.ID = uuid.New()
	return nil
}

type Book struct {
	BaseModel
	Name        string `gorm:"column:name"`
	Description string `gorm:"column:description"`
	Currency    string `gorm:"column:currency"`
	StartMonth  int32  `gorm:"column:start_month"`

	// relations
	Accounts []Account `gorm:"foreignKey:book_id"`
}

type Period struct {
	BaseModel
	BookID   uuid.UUID `gorm:"column:book_id;type:uuid;uniqueIndex:idx_book_id_year"`
	Year     int32     `gorm:"column:year;uniqueIndex:idx_book_id_year"`
	IsClosed bool      `gorm:"column:is_closed"`

	// relations
	Book Book `gorm:"foreignKey:book_id;references:id"`
}

type Budget struct {
	BaseModel
	Name        string    `gorm:"column:name"`
	Description string    `gorm:"column:description"`
	PeriodID    uuid.UUID `gorm:"column:period_id;type:uuid"`

	// relations
	Period Period `gorm:"foreignKey:period_id;references:id"`
}

type Account struct {
	BaseModel
	BookID      uuid.UUID     `gorm:"column:book_id;type:uuid"`
	Name        string        `gorm:"column:name;index"`
	Description string        `gorm:"column:description"`
	Type        int32         `gorm:"column:type;uniqueIndex:idx_accounts_type_parent_id_code"`
	ParentID    uuid.NullUUID `gorm:"column:parent_id;type:uuid;uniqueIndex:idx_accounts_type_parent_id_code"`
	Code        string        `gorm:"column:code;uniqueIndex:idx_accounts_type_parent_id_code;index"`
	IsGroup     bool          `gorm:"column:is_group;index"`

	// relations
	Book   Book     `gorm:"foreignKey:book_id;references:id"`
	Parent *Account `gorm:"foreignKey:parent_id;references:id"`
}

type BudgetAccountTarget struct {
	BaseModel
	BudgetID  uuid.UUID `gorm:"column:budget_id;type:uuid;uniqueIndex:idx_budget_id_account_id"`
	AccountID uuid.UUID `gorm:"column:account_id;type:uuid;uniqueIndex:idx_budget_id_account_id"`
	Value     int64     `gorm:"column:value"`

	// relations
	Budget  Budget  `gorm:"foreignKey:budget_id;references:id"`
	Account Account `gorm:"foreignKey:account_id;references:id"`
}

type Transaction struct {
	BaseModel
	AccountID   uuid.UUID `gorm:"column:account_id;type:uuid"`
	Value       int64     `gorm:"column:value"`
	Description string    `gorm:"column:description"`
	Reference   string    `gorm:"reference;index"`
	BookedAt    time.Time `gorm:"column:booked_at"`

	ImportProvider  sql.NullInt32  `gorm:"column:import_provider;index"`
	ImportReference sql.NullString `gorm:"column:import_reference;index"`

	// relations
	Account Account `gorm:"foreignKey:account_id;references:id"`
}

type ImportReferenceIgnoredItem struct {
	BaseModel
	BookID    uuid.UUID `gorm:"column:book_id;type:uuid"`
	Provider  int       `gorm:"column:provider;uniqueIndex:idx_provider_reference;index"`
	Reference string    `gorm:"column:reference;uniqueIndex:idx_provider_reference;index"`

	// relations
	Book Book `gorm:"foreignKey:book_id;references:id"`
}
