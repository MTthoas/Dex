package queries

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/MTthoas/dex/api/models"
	"gorm.io/gorm"
)

type TokenQueries struct {
	DB *gorm.DB
}

func GetEthereumTokens() []models.Coin {
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

	// print body

	var tokens []models.Coin
	err = json.Unmarshal(body, &tokens)
	if err != nil {
		log.Printf("Erreur lors du décodage du JSON : %v", err)
		return nil
	}

	return tokens
}

func GetEthereumTokenByAddress(address string) *models.Token {
	apiUrl := fmt.Sprintf("https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=%s&vs_currencies=usd", address)

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

	var token models.Token
	err = json.Unmarshal(body, &token)
	if err != nil {
		log.Printf("Erreur lors du décodage du JSON : %v", err)
		return nil
	}

	return &token
}

func (tq *TokenQueries) GetTokens() ([]models.Token, error) {
	var tokens []models.Token
	if err := tq.DB.Find(&tokens).Error; err != nil {
		return nil, err
	}
	return tokens, nil
}

func (tq *TokenQueries) CreateToken(token models.Token) (models.Token, error) {
	if err := tq.DB.Create(&token).Error; err != nil {
		return models.Token{}, err
	}
	return token, nil
}

func (tq *TokenQueries) UpdateToken(token models.Token) (models.Token, error) {
	var existingToken models.Token
	if err := tq.DB.First(&existingToken, token.Id).Error; err != nil {
		return models.Token{}, err // Return an error if the token doesn't exist
	}

	// Update the fields
	existingToken.Name = token.Name
	existingToken.Symbol = token.Symbol
	existingToken.Image = token.Image
	existingToken.Address = token.Address
	existingToken.CurrentPrice = token.CurrentPrice
	existingToken.MarketCap = token.MarketCap
	existingToken.MarketCapRank = token.MarketCapRank
	existingToken.TotalVolume = token.TotalVolume
	existingToken.PriceChange24h = token.PriceChange24h
	existingToken.PriceChangePercentage24h = token.PriceChangePercentage24h
	existingToken.MarketCapChange24h = token.MarketCapChange24h
	existingToken.MarketCapChangePercentage = token.MarketCapChangePercentage
	existingToken.TotalSupply = token.TotalSupply
	existingToken.MaxSupply = token.MaxSupply

	// print the updated token
	fmt.Println(existingToken)

	if err := tq.DB.Save(&existingToken).Error; err != nil {
		return models.Token{}, err
	}
	return existingToken, nil
}

func (tq *TokenQueries) DeleteToken(id string) error {
	if err := tq.DB.Delete(&models.Token{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (tq *TokenQueries) GetTokenById(id string) (models.Token, error) {
	var token models.Token
	if err := tq.DB.Where("id = ?", id).First(&token).Error; err != nil {
		return models.Token{}, err
	}
	return token, nil
}

func (tq *TokenQueries) GetTokenBySymbol(symbol string) (models.Token, error) {
	var token models.Token
	if err := tq.DB.Where("symbol = ?", symbol).First(&token).Error; err != nil {
		return models.Token{}, err
	}
	return token, nil
}

func (tq *TokenQueries) GetTokenByAddress(address string) (models.Token, error) {
	var token models.Token
	if err := tq.DB.Where("address = ?", address).First(&token).Error; err != nil {
		return models.Token{}, err
	}
	return token, nil
}
