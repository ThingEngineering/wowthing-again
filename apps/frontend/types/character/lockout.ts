export interface CharacterLockout {
    bosses: CharacterLockoutBoss[];
    defeatedBosses: number;
    difficulty: number;
    id: number;
    locked: boolean;
    maxBosses: number;
    name: string;
    resetTime: string; // datetime?
    mangled?: boolean;
}

export interface CharacterLockoutBoss {
    dead: boolean;
    name: string;
}
