.PHONY: clean test build run migrate.up migrate.down migrate.force docker.run docker.network docker.fiber.build docker.fiber docker.postgres docker.stop docker.stop.fiber docker.stop.postgres swag

APP_NAME = apiserver
BUILD_DIR = build
MIGRATIONS_FOLDER = $(CURDIR)/platform/migrations
DATABASE_URL = postgres://postgres:password@localhost/postgres?sslmode=disable

# clean:
# 	if exist $(BUILD_DIR) rmdir /s /q $(BUILD_DIR)
# 	del /f /q cover.out 2>nul

test:
	go test -v -timeout 30s -coverprofile=cover.out -cover ./...
	go tool cover -func=cover.out

build: clean test
	go build -ldflags="-w -s" -o $(BUILD_DIR)/$(APP_NAME) main.go

run: swag build
	$(BUILD_DIR)/$(APP_NAME)

migrate.up:
	migrate -path $(MIGRATIONS_FOLDER) -database "$(DATABASE_URL)" up

migrate.down:
	migrate -path $(MIGRATIONS_FOLDER) -database "$(DATABASE_URL)" down

migrate.force:
	migrate -path $(MIGRATIONS_FOLDER) -database "$(DATABASE_URL)" force $(version)

docker.run: docker.network docker.postgres swag docker.fiber migrate.up

docker.network:
	-docker network create -d bridge dev-network

docker.fiber.build:
	docker build -t fiber .

docker.fiber: docker.fiber.build
	docker run --rm -d --name dev-fiber --network dev-network -p 5000:5000 fiber

docker.postgres:
	docker run --rm -d --name dev-postgres --network dev-network -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=postgres -v ${HOME}/dev-postgres/data/:/var/lib/postgresql/data -p 5432:5432 postgres

docker.stop: docker.stop.fiber docker.stop.postgres

docker.stop.fiber:
	docker stop dev-fiber

docker.stop.postgres:
	docker stop dev-postgres

swag:
	swag init -g main.go
