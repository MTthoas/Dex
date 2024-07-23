package models

type Coin struct {
	Symbol                    string  `json:"symbol"`
	Name                      string  `json:"name"`
	Image                     string  `json:"image"`
	CurrentPrice              float64 `json:"current_price"`
	MarketCap                 float64 `json:"market_cap"`
	MarketCapRank             int     `json:"market_cap_rank"`
	TotalVolume               float64 `json:"total_volume"`
	PriceChange24h            float64 `json:"price_change_24h"`
	PriceChangePercentage24h  float64 `json:"price_change_percentage_24h"`
	MarketCapChange24h        float64 `json:"market_cap_change_24h"`
	MarketCapChangePercentage float64 `json:"market_cap_change_percentage_24h"`
	TotalSupply               float64 `json:"total_supply"`
	MaxSupply                 float64 `json:"max_supply"`
	LastUpdated               string  `json:"last_updated"`
}
