package database

import (
	"os"

	"github.com/MTthoas/dex/api/models"
	"github.com/MTthoas/dex/api/queries"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Queries struct {
	*queries.UserQueries
	*queries.TransactionQueries
	*queries.PoolQueries
	*queries.TokenQueries
}

func OpenDBConnection() (*Queries, error) {
	dsn := os.Getenv("DB_SERVER_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// AutoMigrate for all referenced models
	if err := db.AutoMigrate(&models.User{}, &models.Transaction{}, &models.Pool{}, &models.Token{}); err != nil {
		return nil, err
	}

	return &Queries{
		UserQueries:        &queries.UserQueries{DB: db},
		TransactionQueries: &queries.TransactionQueries{DB: db},
		PoolQueries:        &queries.PoolQueries{DB: db},
		TokenQueries:       &queries.TokenQueries{DB: db},
	}, nil
}
