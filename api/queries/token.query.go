package queries

import (
	"github.com/MTthoas/dex/api/models"
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

func ScrapeEthereumTokens() []models.Token {

	apiUrl := os.Getenv("API_URL")

	resp, err := http.Get(apiUrl)
	if err != nil {
		log.Printf("Erreur lors de la requête GET : %v", err)
		return nil
	}

	var buf bytes.Buffer
	_, err = buf.ReadFrom(resp.Body)
	if err != nil {
		log.Fatalf("Erreur lors de la lecture de la réponse : %v", err)
	}
	bodyString := buf.String()
	fmt.Println("Réponse brute de l'API :", bodyString)

	// Décoder le JSON directement depuis le buffer
	var tokens []models.Token
	err = json.Unmarshal(buf.Bytes(), &tokens)
	if err != nil {
		log.Fatalf("Erreur lors du décodage du JSON : %v", err)
	}

	return tokens
}
