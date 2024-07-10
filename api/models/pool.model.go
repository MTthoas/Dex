package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type Pool struct {
    Base
    Name               string    `json:"name"`
    Symbol             string    `json:"symbol"`
    PoolAddress        string    `json:"pool_address"`
    FirstTokenName     string    `json:"first_token_name"`
    FirstTokenAddress  string    `json:"first_token_address"`
    SecondTokenAddress string    `json:"second_token_address"`
    SecondTokenName    string    `json:"second_token_name"`
    FirstTokenAmount   *float64  `json:"first_token_amount"`
    SecondTokenAmount  *float64  `json:"second_token_amount"`
    YieldValue         *float64  `json:"yield_value"`
    TotalVolume        *float64  `json:"total_volume"`
    TotalLiquidity     *float64  `json:"total_liquidity"`
    TotalFees          *float64  `json:"total_fees"`
    TotalTrades        *int      `json:"total_trades"`
    Addresses          []string  `json:"addresses" gorm:"type:json"`
}

// GormDataType interface implementation to specify JSON storage
func (Pool) GormDataType() string {
    return "json"
}

// Value method to convert type for storage
func (p Pool) Value() (driver.Value, error) {
    if len(p.Addresses) == 0 {
        return nil, nil
    }
    return json.Marshal(p.Addresses)
}

// Scan method to read value from storage
func (p *Pool) Scan(value interface{}) error {
    bytes, ok := value.([]byte)
    if !ok {
        return errors.New("Failed to unmarshal JSONB value for Addresses")
    }
    result := json.Unmarshal(bytes, &p.Addresses)
    return result
}
