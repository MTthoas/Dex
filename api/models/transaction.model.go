package models

type Transaction struct {
	Base
	From        string  `json:"from" example:"0x123abc"`
	To          string  `json:"to" example:"0x456def"`
	Amount      float64 `json:"amount" example:"99.99"`
	Transaction string  `json:"transaction" example:"tx_789ghi"`
}

func (transaction *Transaction) TableName() string {
	return "transaction"
}
