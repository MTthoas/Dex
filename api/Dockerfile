# Utilisation d'une image de builder Go avec Alpine pour un environnement minimal.
FROM golang:1.21-alpine AS builder

# Installation de git, nécessaire pour récupérer les modules Go et Swaggo.
RUN apk add --no-cache git

# Installation des certificats CA, cruciaux pour les appels HTTPS.
RUN apk add --no-cache ca-certificates

# Installation de Swag CLI pour la documentation Swagger.
RUN go install github.com/swaggo/swag/cmd/swag@latest

# Définir le répertoire de travail où se trouve le code source.
WORKDIR /api

# Copie des fichiers de module Go et téléchargement des dépendances.
COPY go.mod go.sum ./
RUN go mod download

# Copie du reste de l'API dans l'image.
COPY . .

# Génération de la documentation Swagger.
RUN swag init --generalInfo ./routes/swagger_routes.go --output ./docs

# Configuration des variables d'environnement nécessaires pour la construction.
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64

# Construction du serveur API.
RUN go build -ldflags="-s -w" -o apiserver .

# Utilisation d'une image scratch pour un environnement d'exécution minimal.
FROM scratch

# Copie du binaire, des fichiers de configuration, et de la documentation Swagger.
COPY --from=builder /api/apiserver /
COPY --from=builder /api/.env /
COPY --from=builder /api/docs /docs

# Copie des certificats CA.
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Exposition du port sur lequel le serveur API s'exécute.
EXPOSE 5000

# Commande pour exécuter le serveur API lors du démarrage du conteneur.
CMD ["/apiserver"]
