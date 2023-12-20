package services

import (
	"github.com/MTthoas/dex/api/models"
	"encoding/json"
	"log"
	"fmt"
	"net/http"
)
var ApiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=ethereum-ecosystem&order=market_cap_desc&per_page=30&page=1&sparkline=false&locale=en"

func ScrapeEthereumTokens() []models.Token {
    // Faire une requête GET à l'API
    resp, err := http.Get(ApiUrl)
    if err != nil {
        log.Fatal("Erreur lors de la requête à l'API :", err)
    }
    defer resp.Body.Close()

    // Décoder le JSON reçu
    var tokens []models.Token
	err = json.NewDecoder(resp.Body).Decode(&tokens)
	if err != nil {
		log.Fatal("Erreur lors du décodage du JSON :", err)
	}


    // Afficher les tokens récupérés pour le debug
    fmt.Println("Tokens récupérés :", tokens)

    return tokens
}