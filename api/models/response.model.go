package models

type ResponseStruct struct {
		Success bool `json:"success"`
		Timestamp int64 `json:"timestamp"`
		AmountOfCoins int `json:"amount_of_coins"`
		Tokens []Token `json:"tokens"`
	}