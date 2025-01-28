package sql

import (
	"time"

	"github.com/google/uuid"
)

type BaseModel struct {
	ID        uuid.UUID `gorm:"column:id;type:uuid;primaryKey"`
	CreatedAt time.Time `gorm:"column:created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at"`
	DeletedAt time.Time `gorm:"column:deleted_at"`
}

type Book struct {
	BaseModel
	Name        string `gorm:"column:name"`
	Description string `gorm:"column:description"`
	Currency    string `gorm:"column:currency"`
	StartMonth  int32  `gorm:"column:start_month"`

	// relations
	Accounts []Account `gorm:"foreignKey:id;references:book_id"`
}

type Period struct {
	BaseModel
	BookID   uuid.UUID `gorm:"column:book_id;type:uuid"`
	Year     int32     `gorm:"column:year"`
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
	Name        string        `gorm:"column:name"`
	Description string        `gorm:"column:description"`
	Type        int32         `gorm:"column:type"`
	ParentID    uuid.NullUUID `gorm:"column:parent_id;type:uuid"`
	Code        int32         `gorm:"column:code"`

	// relations
	Book   Book     `gorm:"foreignKey:book_id;references:id"`
	Parent *Account `gorm:"foreignKey:parent_id;references:id"`
}

type Transaction struct {
	BaseModel
	AccountID   uuid.UUID `gorm:"column:account_id;type:uuid"`
	Value       int64     `gorm:"column:value"`
	Description string    `gorm:"column:description"`
	BookedAt    time.Time `gorm:"column:booked_at"`

	// relations
	Account Account `gorm:"foreignKey:account_id;references:id"`
}
