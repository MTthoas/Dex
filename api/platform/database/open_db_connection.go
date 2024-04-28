package database

import (
	"os"

	"github.com/MTthoas/dex/api/queries"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Queries struct for collect all app queries.
type Queries struct {
	*queries.UserQueries // load queries from User model
}

// OpenDBConnection func for opening database connection.
func OpenDBConnection() (*Queries, error) {
	// Assume dsn is your PostgreSQL data source name.
	dsn := os.Getenv("DB_SERVER_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return &Queries{
		UserQueries: &queries.UserQueries{
			DB: db,
		},
	}, nil
}
