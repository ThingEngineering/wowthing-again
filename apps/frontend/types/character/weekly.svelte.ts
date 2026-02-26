import parseApiTime from '@/utils/parse-api-time';
import { CharacterItem, type CharacterItemArray } from './item';

export class CharacterWeekly {
    public delveGilded: number = $state(0);
    public delveWeek: number = $state(0);
    public delves: [number, string][] = $state([]);
    public keystoneDungeon: number = $state(0);
    public keystoneLevel: number = $state(0);
    public keystoneScannedAt: string = $state(null);
    public vault: CharacterWeeklyVault = $state({
        anyThreshold: false,
        availableRewards: false,
        generatedRewards: false,
        dungeonProgress: [],
        raidProgress: [],
        worldProgress: [],
    });
    public vaultScannedAt: string = $state(null);

    public process(
        delveWeek: number,
        delveGilded: number,
        delveLevels: number[],
        delveMaps: string[],
        keystoneScannedAt: string,
        keystoneDungeon: number,
        keystoneLevel: number,
        vaultScannedAt?: string,
        vaultAvailableRewards?: boolean,
        vaultGeneratedRewards?: boolean,
        dungeonProgress?: CharacterWeeklyProgressArray[],
        raidProgress?: CharacterWeeklyProgressArray[],
        worldProgress?: CharacterWeeklyProgressArray[]
    ) {
        this.delveWeek = delveWeek;
        this.delveGilded = delveGilded;
        this.keystoneScannedAt = keystoneScannedAt;
        this.keystoneDungeon = keystoneDungeon;
        this.keystoneLevel = keystoneLevel;

        this.delves = [];
        for (let i = 0; i < delveLevels.length; i++) {
            this.delves.push([delveLevels[i], delveMaps[i]]);
        }

        if (vaultScannedAt) {
            this.vaultScannedAt = vaultScannedAt;
            this.vault.availableRewards = vaultAvailableRewards;
            this.vault.generatedRewards = vaultGeneratedRewards;
            this.vault.dungeonProgress = (dungeonProgress || []).map(
                (array) => new CharacterWeeklyProgress(...array)
            );
            this.vault.raidProgress = (raidProgress || []).map(
                (array) => new CharacterWeeklyProgress(...array)
            );
            this.vault.worldProgress = (worldProgress || []).map(
                (array) => new CharacterWeeklyProgress(...array)
            );
            this.vault.anyThreshold = [
                ...this.vault.dungeonProgress,
                ...this.vault.raidProgress,
                ...this.vault.worldProgress,
            ].some((tier) => tier.progress >= tier.threshold);
        }
    }

    public vaultScannedTime = $derived(parseApiTime(this.vaultScannedAt));
}
export type CharacterWeeklyArray = Parameters<CharacterWeekly['process']>;

export interface CharacterWeeklyVault {
    anyThreshold: boolean;
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
        public itemLevel: number,
        public upgradeItemLevel: number,
        rewardArrays?: CharacterItemArray[]
    ) {
        if (rewardArrays?.length > 0) {
            this.rewards = rewardArrays.map((rewardArray) => new CharacterItem(...rewardArray));
        }
    }
}
type CharacterWeeklyProgressArray = ConstructorParameters<typeof CharacterWeeklyProgress>;
