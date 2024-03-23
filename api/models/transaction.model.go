package models

type Transaction struct {
	Base
	From        string  `json:"from"`
	To          string  `json:"to"`
	Amount      float64 `json:"amount"`
	Transaction string  `json:"transaction"`
}
