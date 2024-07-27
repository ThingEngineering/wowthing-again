import { CharacterItem, type CharacterItemArray } from './item';

export class CharacterWeekly {
    vault: CharacterWeeklyVault;

    constructor(
        public keystoneScannedAt: string,
        public keystoneDungeon: number,
        public keystoneLevel: number,
        public vaultScannedAt?: string,
        public vaultHasRewards?: boolean,
        mythicPlusProgress?: CharacterWeeklyProgressArray[],
        raidProgress?: CharacterWeeklyProgressArray[],
        rankedPvpProgress?: CharacterWeeklyProgressArray[],
    ) {
        if (vaultScannedAt) {
            this.vault = {
                mythicPlusProgress: (mythicPlusProgress || []).map(
                    (array) => new CharacterWeeklyProgress(...array),
                ),
                raidProgress: (raidProgress || []).map(
                    (array) => new CharacterWeeklyProgress(...array),
                ),
                rankedPvpProgress: (rankedPvpProgress || []).map(
                    (array) => new CharacterWeeklyProgress(...array),
                ),
            };
        }
    }
}
export type CharacterWeeklyArray = ConstructorParameters<typeof CharacterWeekly>;

export interface CharacterWeeklyVault {
    mythicPlusProgress: CharacterWeeklyProgress[];
    rankedPvpProgress: CharacterWeeklyProgress[];
    raidProgress: CharacterWeeklyProgress[];
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
            console.log(this.rewards);
        }
    }
}
type CharacterWeeklyProgressArray = ConstructorParameters<typeof CharacterWeeklyProgress>;
