FROM golang:1.21-alpine AS builder

# Install git - required for fetching Go modules and Swaggo.
RUN apk add --no-cache git

# Install Swag CLI.
RUN go install github.com/swaggo/swag/cmd/swag@latest

# Move to the API directory where the Dockerfile and source code are.
WORKDIR /api

# Copy the go module files and download the dependencies.
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire API directory and build it.
COPY . .

# Generate Swagger documentation.
RUN swag init --generalInfo ./routes/swagger_routes.go --output ./docs

# Set necessary environment variables needed for our image.
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64

# Build the API server.
RUN go build -ldflags="-s -w" -o apiserver .

FROM scratch

# Copy binary, config files, and Swagger docs from /api to the root folder of the scratch container.
COPY --from=builder /api/apiserver /
COPY --from=builder /api/.env /
COPY --from=builder /api/docs /docs

# Export necessary port.
EXPOSE 5000

# Command to run when starting the container.
ENTRYPOINT ["/apiserver"]