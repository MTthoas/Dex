package models

type Token struct {
	Base
	Name                      string   `json:"name"`
	Symbol                    string   `json:"symbol"`
	Image                     *string  `json:"image"`
	Address                   string   `json:"address"`
	CurrentPrice              *float64 `json:"current_price"`
	MarketCap                 *float64 `json:"market_cap"`
	MarketCapRank             *int     `json:"market_cap_rank"`
	TotalVolume               *float64 `json:"total_volume"`
	PriceChange24h            *float64 `json:"price_change_24h"`
	PriceChangePercentage24h  *float64 `json:"price_change_percentage_24h"`
	MarketCapChange24h        *float64 `json:"market_cap_change_24h"`
	MarketCapChangePercentage *float64 `json:"market_cap_change_percentage_24h"`
	TotalSupply               *string  `json:"total_supply"` // Peut être null
	MaxSupply                 *string  `json:"max_supply"`   // Peut être null
}
