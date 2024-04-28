package models

// Pool struct for a DEX
type Pool struct {
	Id                        string  `json:"id"`
	Name                      string  `json:"name"`
	Symbol                    string  `json:"symbol"`
	FirstToken                     Token   `json:"first_token"`
	SecondToken                    Token  `json:"second_token"`
	FirstTokenAmount              float64 `json:"first_token_amount"`
	SecondTokenAmount             float64 `json:"second_token_amount"`
	StartDate 			   string  `json:"start_date"`
	EndDate 			   string  `json:"end_date"`
	TotalVolume               float64 `json:"total_volume"`
	TotalLiquidity            float64 `json:"total_liquidity"`
	TotalFees                 float64 `json:"total_fees"`
	TotalTrades               int     `json:"total_trades"`
	UsersList				 []User  `json:"users_list"`
}