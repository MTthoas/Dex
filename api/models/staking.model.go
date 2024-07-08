package models

import (
	"time"
)

type Staking struct {
    StakingID   int       `json:"staking_id" gorm:"primary_key;auto_increment"`
    UserID      int       `json:"user_id" gorm:"index"`      // Foreign key to Users table
    Address     string    `json:"address"`
    AmountStaked float64  `json:"amount_staked"`
	RewardDebt    float64   `json:"reward_debt"`
    LastStakedTime time.Time `json:"last_staked_time"`
    StartDate   time.Time `json:"start_date"`
    EndDate     *time.Time `json:"end_date"`                 // Nullable
    Status      string    `json:"status"`                    // See if it's really usefull
}

func (s *Staking) TableName() string {
    return "staking"
}