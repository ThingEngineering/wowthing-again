export interface CharacterWeekly {
    keystoneScannedAt: string

    keystoneDungeon: number
    keystoneLevel: number

    vault: CharacterWeeklyVault
}

export interface CharacterWeeklyVault {
    mythicPlusProgress: CharacterWeeklyProgress[]
    rankedPvpProgress: CharacterWeeklyProgress[]
    raidProgress: CharacterWeeklyProgress[]
}

export interface CharacterWeeklyProgress {
    level: number
    progress: number
    threshold: number
    tier: number
}
