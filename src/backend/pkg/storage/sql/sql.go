package sql

import "gorm.io/gorm"

type Storage struct {
	DB *gorm.DB
}
