package models

type Pool struct {
	Id                string  `json:"id"`
	Name              string  `json:"name"`
	Symbol            string  `json:"symbol"`
	FirstTokenId      string  `json:"first_token_id"` // Foreign key for FirstToken
	FirstToken        Token   `gorm:"foreignKey:FirstTokenId;references:Id" json:"first_token"`
	SecondTokenId     string  `json:"second_token_id"` // Foreign key for SecondToken
	SecondToken       Token   `gorm:"foreignKey:SecondTokenId;references:Id" json:"second_token"`
	FirstTokenAmount  float64 `json:"first_token_amount"`
	SecondTokenAmount float64 `json:"second_token_amount"`
	StartDate         string  `json:"start_date"`
	EndDate           string  `json:"end_date"`
	TotalVolume       float64 `json:"total_volume"`
	TotalLiquidity    float64 `json:"total_liquidity"`
	TotalFees         float64 `json:"total_fees"`
	TotalTrades       int     `json:"total_trades"`
	UsersList         []User  `gorm:"many2many:user_pools;" json:"users_list"`
}
