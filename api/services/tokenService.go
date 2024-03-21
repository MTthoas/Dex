package services

import (
<<<<<<< HEAD
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/MTthoas/dex/api/models"
	"github.com/joho/godotenv"
	"io"
	"log"
	"net/http"
	"os"
=======
	"github.com/MTthoas/dex/api/models"
	"encoding/json"
	"log"
	"fmt"
	"net/http"
	"io/ioutil"
	"bytes"
	"os"
	"github.com/joho/godotenv"
>>>>>>> main
)

func goDotEnvVariable(key string) string {

	// load .env file
	err := godotenv.Load(".env")
<<<<<<< HEAD

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return os.Getenv(key)
}

func ScrapeEthereumTokens() ([]models.Token, error) {

	apiUrl := goDotEnvVariable("API_URL")

	resp, err := http.Get(apiUrl)
	if err != nil {
        log.Printf("Erreur lors de la requête GET : %v", err)
        return nil, err 
    }

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Erreur lors de la lecture de la réponse : %v", err)
=======
  
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
>>>>>>> main
	}
	bodyString := string(bodyBytes)
	fmt.Println("Réponse brute de l'API :", bodyString)

	// Réinitialiser le body pour le décodage JSON
<<<<<<< HEAD
	resp.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	// Décoder le JSON reçu
	var tokens []models.Token
	err = json.NewDecoder(resp.Body).Decode(&tokens)
	if err != nil {
		log.Fatalf("Erreur lors de la lecture de la réponse : %v", err)
	}

	return tokens, nil
=======
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
>>>>>>> main
}