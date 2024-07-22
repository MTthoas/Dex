package models

type EnumTransactionType string

const (
	Send            EnumTransactionType = "send"
	Swap            EnumTransactionType = "swap"
	Stack           EnumTransactionType = "stack"
	AddLiquidity    EnumTransactionType = "add_liquidity"
	RemoveLiquidity EnumTransactionType = "remove_liquidity"
)

type Transaction struct {
	Base
	From    string              `json:"from" example:"0x123abc"`
	To      string              `json:"to" example:"0x456def"`
	Hash    string              `json:"hash" example:"0x789ghi"`
	AmountA float64             `json:"amount_a" example:"99.99"`
	AmountB float64             `json:"amount_b" example:"99.99"`
	Type    EnumTransactionType `json:"type" example:"send"`
	SymbolA *string             `json:"symbol_a,omitempty" example:"ETH"`
	SymbolB *string             `json:"symbol_b,omitempty" example:"USDT"`
}
