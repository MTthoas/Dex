package services

import (
	"github.com/MTthoas/dex/api/models"
	"encoding/json"
	"log"
	"fmt"
	"net/http"
	"io/ioutil"
	"bytes"
	"os"
	"github.com/joho/godotenv"
)

func goDotEnvVariable(key string) string {

	// load .env file
	err := godotenv.Load(".env")
  
	if err != nil {
	  log.Fatalf("Error loading .env file")
	}
  
	return os.Getenv(key)
  }
  
func ScrapeEthereumTokens() []models.Token {

	apiUrl := goDotEnvVariable("API_URL")

    resp, err := http.Get(apiUrl)
    if err != nil {	
		fmt.Println("Erreur lors de la requête GET :", err)
    }
    defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal("Erreur lors de la lecture de la réponse :", err)
	}
	bodyString := string(bodyBytes)
	fmt.Println("Réponse brute de l'API :", bodyString)

	// Réinitialiser le body pour le décodage JSON
	resp.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))

    // Décoder le JSON reçu
    var tokens []models.Token
	err = json.NewDecoder(resp.Body).Decode(&tokens)
	if err != nil {
		fmt.Println("Erreur lors du décodage JSON :", err)
	}


    // Afficher les tokens récupérés pour le debug
    fmt.Println("Tokens récupérés :", tokens)

    return tokens
}