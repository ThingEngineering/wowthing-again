import { CharacterItem, type CharacterItemArray } from './item';

export class CharacterWeekly {
    public delves: [number, string][];
    public vault: CharacterWeeklyVault;

    constructor(
        public delveWeek: number,
        delveLevels: number[],
        delveMaps: string[],
        public keystoneScannedAt: string,
        public keystoneDungeon: number,
        public keystoneLevel: number,
        public vaultScannedAt?: string,
        vaultAvailableRewards?: boolean,
        vaultGeneratedRewards?: boolean,
        dungeonProgress?: CharacterWeeklyProgressArray[],
        raidProgress?: CharacterWeeklyProgressArray[],
        worldProgress?: CharacterWeeklyProgressArray[],
    ) {
        this.delves = [];
        for (let i = 0; i < delveLevels.length; i++) {
            this.delves.push([delveLevels[i], delveMaps[i]]);
        }

        if (vaultScannedAt) {
            this.vault = {
                availableRewards: vaultAvailableRewards,
                generatedRewards: vaultGeneratedRewards,
                dungeonProgress: (dungeonProgress || []).map(
                    (array) => new CharacterWeeklyProgress(...array),
                ),
                raidProgress: (raidProgress || []).map(
                    (array) => new CharacterWeeklyProgress(...array),
                ),
                worldProgress: (worldProgress || []).map(
                    (array) => new CharacterWeeklyProgress(...array),
                ),
            };
        }
    }
}
export type CharacterWeeklyArray = ConstructorParameters<typeof CharacterWeekly>;

export interface CharacterWeeklyVault {
    availableRewards: boolean;
    generatedRewards: boolean;
    dungeonProgress: CharacterWeeklyProgress[];
    raidProgress: CharacterWeeklyProgress[];
    worldProgress: CharacterWeeklyProgress[];
}

export class CharacterWeeklyProgress {
    public rewards: CharacterItem[];

    constructor(
        public level: number,
        public tier: number,
        public progress: number,
        public threshold: number,
        rewardArrays?: CharacterItemArray[],
    ) {
        if (rewardArrays?.length > 0) {
            this.rewards = rewardArrays.map((rewardArray) => new CharacterItem(...rewardArray));
        }
    }
}
type CharacterWeeklyProgressArray = ConstructorParameters<typeof CharacterWeeklyProgress>;
