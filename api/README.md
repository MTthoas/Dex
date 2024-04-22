# Create Network

docker network create -d bridge dev-network

# PostgreSQL and initial Migration

docker run --rm -d --name dev-postgres --network dev-network -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=postgres -v \${HOME}/dev-postgres/data/:/var/lib/postgresql/data -p 5432:5432 postgres

docker run --rm -d \
 --name dev-postgres \
 --network dev-network \
 -e POSTGRES_USER=postgres \
 -e POSTGRES_PASSWORD=password \
 -e POSTGRES_DB=postgres \
 -v \${HOME}/dev-postgres/data/:/var/lib/postgresql/data \
 -p 5432:5432 \
 postgres

# Migrate

migrate -path ./migrations -database "postgres://postgres:password@localhost/postgres?sslmode=disable" up

# Build Fiber docker Image ( DockerFile )

docker build -t fiber .

# Create and start container from image

docker run --rm -d --name dev-fiber --network dev-network -p 5000:5000 fiber

## IN LOCAL

docker build -t api-build .

go install github.com/swaggo/swag/cmd/swag@latest
swag init --generalInfo ./routes/swagger_routes.go --output ./docs

> > go run main.go
