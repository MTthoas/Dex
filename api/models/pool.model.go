package models

type Pool struct {
	Base
	Name               string    `json:"name"`
	Symbol             string    `json:"symbol"`
	PoolAddress        string    `json:"pool_address"`
	FirstTokenName	string    `json:"first_token_name"`
	FirstTokenAddress  string    `json:"first_token_address"`
	SecondTokenAddress string    `json:"second_token_address"`
	SecondTokenName     string    `json:"second_token_name"`
	FirstTokenAmount   *float64   `json:"first_token_amount"`
	SecondTokenAmount  *float64   `json:"second_token_amount"`
	YieldValue         *float64   `json:"yield_value"`
	TotalVolume        *float64   `json:"total_volume"`
	TotalLiquidity     *float64   `json:"total_liquidity"`
	TotalFees          *float64   `json:"total_fees"`
	TotalTrades        *int       `json:"total_trades"`
	// Add a list of address empty
	Addresses          []string  `json:"addresses"`
	
}
