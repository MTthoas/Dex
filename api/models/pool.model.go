package models

type Pool struct {
	Id                 string  `json:"id"`
	Name               string  `json:"name"`
	Symbol             string  `json:"symbol"`
	FirstTokenAddress  string  `json:"first_token_address"`
	SecondTokenAddress string  `json:"second_token_address"`
	FirstTokenAmount   float64 `json:"first_token_amount"`
	SecondTokenAmount  float64 `json:"second_token_amount"`
	StartDate          string  `json:"start_date"`
	EndDate            string  `json:"end_date"`
	TotalVolume        float64 `json:"total_volume"`
	TotalLiquidity     float64 `json:"total_liquidity"`
	TotalFees          float64 `json:"total_fees"`
	TotalTrades        int     `json:"total_trades"`
}
