package models

import (
	"time"
)

type Staking struct {
    Base
    UserID      int       `json:"user_id" gorm:"index"`      // Foreign key to Users table
    Address     string    `json:"address"`
    AmountStaked float64  `json:"amount_staked"`
	RewardDebt    float64   `json:"reward_debt"`
    LastStakedTime time.Time `json:"last_staked_time"`
    StartDate   time.Time `json:"start_date"`
    EndDate     *time.Time `json:"end_date"`                 // Nullable
}

/*
Pour la partie d'affichage de données, peut-être faire l'appel côté api afin
mettre une variable global cote sc booleen qui passe à 1 si une modif a été faite côté SC
Appeler une fonction pour mettre à jour
*/