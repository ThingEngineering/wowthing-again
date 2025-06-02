export interface CharacterReputation {
    sets: CharacterReputationReputation[][];
}

export interface CharacterReputationReputation {
    reputationId: number;
    value: number;
}

export interface CharacterReputationParagon {
    rewardAvailable: boolean;
    current: number;
    max: number;
    received: number;
}
