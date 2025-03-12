import { DateTime } from 'luxon';

import parseApiTime from '@/utils/parse-api-time';

import type { Account } from './account';
import type { BackgroundImage } from './background-image';
import type { Character, CharacterArray, CharacterLockout } from './character';
import type { InstanceDifficulty } from './dungeon';
import type { Guild, GuildArray } from './guild';
import type { HasNameAndRealm, UserItem } from './shared';
import type { UserCount } from './user-count';
import type { ItemQuality } from '@/enums/item-quality';
import type { WarbankItem, WarbankItemArray } from './items/warbank';

export interface UserData {
    lastApiCheck: string;
    public: boolean;

    accounts: Record<number, Account>;
    charactersRaw: CharacterArray[];
    goldHistoryRealms: number[];
    guildsRaw: GuildArray[];
    heirlooms: Record<number, number>;
    illusionIds: number[];
    raiderIoScoreTiers: Record<number, UserDataRaiderIoScoreTiers>;
    warbankItems: WarbankItem[];

    honorCurrent: number;
    honorLevel: number;
    honorMax: number;
    warbankGold: number;

    backgrounds: Record<number, BackgroundImage>;
    currentPeriod: Record<number, UserDataCurrentPeriod>;
    globalDailies: Record<string, DailyQuests>;
    images: Record<string, string>;

    // Packed data
    mountsPacked: string;
    toysPacked: string;

    petsRaw: Record<number, UserDataPetArray[]>;
    rawAppearanceIds: number[];
    rawAppearanceSources: Record<number, number[]>;
    rawWarbankItems: WarbankItemArray[];

    // Calculated
    allLockouts: (InstanceDifficulty & { characters: [Character, CharacterLockout][] })[];
    allLockoutsMap: Record<string, InstanceDifficulty>;
    allRegions: number[];
    backgroundList: BackgroundImage[];
    homeLockouts: InstanceDifficulty[];

    activeCharacters: Character[];
    apiUpdatedCharacters: Character[];
    characters: Character[];
    characterMap: Record<number, Character>;
    charactersByConnectedRealm: Record<number, Character[]>;
    charactersByRealm: Record<number, Character[]>;

    guildMap: Record<number, Guild>;

    hasMount: Record<number, boolean>;
    hasPet: Record<number, boolean>;
    hasToy: Record<number, boolean>;
    hasToyById: Record<number, boolean>;

    itemsByAppearanceId: Record<number, [HasNameAndRealm, UserItem[]][]>;
    itemsByAppearanceSource: Record<string, [HasNameAndRealm, UserItem[]][]>;
    itemsById: Record<number, [HasNameAndRealm, UserItem[]][]>;
    warbankItemsByItemId: Record<number, UserItem[]>;

    pets: Record<number, UserDataPet[]>;
    setCounts: Record<string, Record<string, UserCount>>;

    appearanceMask?: Map<number, number>;
    hasAppearance?: Set<number>;
    hasIllusion?: Set<number>;
    hasRecipe?: Set<number>;
    hasSource?: Set<string>;
    hasSourceV2?: Map<number, Set<number>>;
    maxReputation?: Map<number, number>;
}

export class UserDataCurrentPeriod {
    public id: number;
    public region: number;
    public starts: string;
    public ends: string;

    private _startTime: DateTime;
    get startTime(): DateTime {
        if (!this._startTime) {
            this._startTime = parseApiTime(this.starts);
        }
        return this._startTime;
    }

    set startTime(time: DateTime) {
        this._startTime = time;
    }

    private _endTime: DateTime;
    get endTime(): DateTime {
        if (!this._endTime) {
            if (this.ends) {
                this._endTime = parseApiTime(this.ends);
            } else {
                this._endTime = DateTime.fromObject({
                    year: 2099,
                });
            }
        }
        return this._endTime;
    }

    set endTime(time: DateTime) {
        this._endTime = time;
    }
}

export class UserDataPet {
    constructor(
        public level: number,
        public quality: number,
        public breedId: number,
    ) {}
}

export type UserDataPetArray = ConstructorParameters<typeof UserDataPet>;

export interface UserDataRaiderIoScoreTiers {
    score: number[];
    rgbHex: string[];
}

export interface DailyQuests {
    expansion: number;
    questExpires: number[];
    questIds: number[];
    questRewards: DailyQuestsReward[];
    region: number;
}

export interface DailyQuestsReward {
    currencyId: number;
    itemId: number;
    money: number;
    quality: ItemQuality;
    quantity: number;
}
