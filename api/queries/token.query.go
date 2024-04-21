package queries

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/MTthoas/dex/api/models"
)

func GetTokens() []models.Token {

	apiUrl := "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=ethereum-ecosystem"

	req, err := http.NewRequest("GET", apiUrl, nil)
	if err != nil {
		log.Printf("Erreur lors de la création de la requête : %v", err)
		return nil
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("x-cg-demo-api-key", os.Getenv("CG_API_KEY"))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("Erreur lors de l'exécution de la requête : %v", err)
		return nil
	}

	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Printf("Le serveur a répondu par le code: %d", res.StatusCode)
		return nil
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("Erreur lors de la lecture de la réponse : %v", err)
		return nil
	}

	var tokens []models.Token
	err = json.Unmarshal(body, &tokens)
	if err != nil {
		log.Printf("Erreur lors du décodage du JSON : %v", err)
		return nil
	}

	return tokens
}

func GetToken(tokenID string) *models.Token {
	// Construction de l'URL avec le token ID comme paramètre
	apiUrl := fmt.Sprintf("https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=%s&vs_currencies=usd", tokenID)

	// Création de la requête HTTP
	req, err := http.NewRequest("GET", apiUrl, nil)
	if err != nil {
		log.Printf("Erreur lors de la création de la requête : %v", err)
		return nil
	}

	// Ajout des headers nécessaires
	req.Header.Add("Accept", "application/json")
	req.Header.Add("x-cg-demo-api-key", os.Getenv("CG_API_KEY"))

	// Exécution de la requête
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("Erreur lors de l'exécution de la requête : %v", err)
		return nil
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Printf("Le serveur a répondu par le code: %d", res.StatusCode)
		return nil
	}

	// Lecture de la réponse
	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("Erreur lors de la lecture de la réponse : %v", err)
		return nil
	}

	// Décodage du JSON
	var token models.Token
	err = json.Unmarshal(body, &token)
	if err != nil {
		log.Printf("Erreur lors du décodage du JSON : %v", err)
		return nil
	}

	return &token
}
