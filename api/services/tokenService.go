package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/MTthoas/dex/api/models"
	"github.com/joho/godotenv"
	"io"
	"log"
	"net/http"
	"os"
)

func goDotEnvVariable(key string) string {

	// load .env file
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv(key)
}

func ScrapeEthereumTokens() []models.Token {

	apiUrl := goDotEnvVariable("API_URL")

	resp, err := http.Get(apiUrl)
	if err != nil {
		log.Fatal("Erreur lors de la requête GET :", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Erreur lors de la lecture de la réponse : %v", err)
	}
	bodyString := string(bodyBytes)
	fmt.Println("Réponse brute de l'API :", bodyString)

	// Réinitialiser le body pour le décodage JSON
	resp.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	// Décoder le JSON reçu
	var tokens []models.Token
	err = json.NewDecoder(resp.Body).Decode(&tokens)
	if err != nil {
		log.Fatalf("Erreur lors de la lecture de la réponse : %v", err)
	}

	// Afficher les tokens récupérés pour le debug
	fmt.Println("Tokens récupérés :", tokens)

	return tokens
}