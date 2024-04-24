package database

import (
	"os"

	"github.com/MTthoas/dex/api/models"
	"github.com/MTthoas/dex/api/queries"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Queries struct for collect all app queries.
type Queries struct {
	*queries.UserQueries
	*queries.TransactionQueries
	*queries.PoolQueries
	*queries.TokenQueries
}

// OpenDBConnection func for opening database connection.
func OpenDBConnection() (*Queries, error) {
	dsn := os.Getenv("DB_SERVER_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Perform auto-migration to keep the schema updated.
	err = db.AutoMigrate(&models.User{}, &models.Transaction{})
	if err != nil {
		return nil, err
	}

	return &Queries{
		UserQueries: &queries.UserQueries{
			DB: db,
		},
		TransactionQueries: &queries.TransactionQueries{
			DB: db,
		},
	}, nil
}
