// import xor from 'lodash/xor';

import { JournalEncounterFlags } from '@/enums/journal-encounter-flags';
import type { RewardType } from '@/enums/reward-type';

export interface JournalData {
    // stats?: Record<string, UserCount>
    itemExpansion: Record<number, number[]>;
    tiers: JournalDataTier[];
    tokenEncounters: string[];

    // calculated
    expandedItem: Record<number, number[]>;
    instanceById: Record<number, JournalDataInstance>;
}

export interface JournalDataTier {
    id: number;
    name: string;
    slug: string;
    instances: JournalDataInstance[];
    subTiers?: JournalDataTier[];
}

export interface JournalDataInstance {
    id: number;
    name: string;
    slug: string;
    bonusIds?: Record<number, number>;
    encounters: JournalDataEncounter[];
    encountersRaw: JournalDataEncounterArray[];
    isRaid?: boolean;
    order?: number;
}

export class JournalDataEncounter {
    public groups: JournalDataEncounterItemGroup[];
    public statistics?: Record<number, number[]>;

    constructor(
        public id: number,
        public flags: number,
        public name: string,
        groupsRaw: JournalDataEncounterItemGroupArray[],
        statisticsRaw?: [number, number[]][]
    ) {
        this.groups = groupsRaw.map(
            (groupArray) => new JournalDataEncounterItemGroup(...groupArray)
        );

        this.statistics = {};
        for (const [difficulty, statisticIds] of statisticsRaw || []) {
            this.statistics[difficulty] = statisticIds;
        }
    }

    get allianceOnly(): boolean {
        return (this.flags & JournalEncounterFlags.AllianceOnly) > 0;
    }
    get hordeOnly(): boolean {
        return (this.flags & JournalEncounterFlags.HordeOnly) > 0;
    }
}

type JournalDataEncounterArray = ConstructorParameters<typeof JournalDataEncounter>;

export class JournalDataEncounterItemGroup {
    public items: JournalDataEncounterItem[];
    //public filteredItems: JournalDataEncounterItem[]

    constructor(
        public name: string,
        itemsRaw: JournalDataEncounterItemArray[]
    ) {
        this.items = itemsRaw.map((itemArray) => new JournalDataEncounterItem(...itemArray));
    }
}

type JournalDataEncounterItemGroupArray = ConstructorParameters<
    typeof JournalDataEncounterItemGroup
>;

export class JournalDataEncounterItem {
    public appearances: JournalDataEncounterItemAppearance[];
    public extraAppearances: number;
    public show: boolean;

    constructor(
        public type: RewardType,
        public id: number,
        public quality: number,
        public classId: number,
        public subclassId: number,
        public classMask: number,
        appearancesRaw: JournalDataEncounterItemAppearanceArray[]
    ) {
        this.appearances = (appearancesRaw || []).map(
            (appearanceArray) => new JournalDataEncounterItemAppearance(...appearanceArray)
        );
    }

    clone(): JournalDataEncounterItem {
        return new JournalDataEncounterItem(
            this.type,
            this.id,
            this.quality,
            this.classId,
            this.subclassId,
            this.classMask,
            this.appearances.map((appearance) => [
                appearance.appearanceId,
                appearance.modifierId,
                appearance.difficulties,
            ])
        );
    }
}

type JournalDataEncounterItemArray = ConstructorParameters<typeof JournalDataEncounterItem>;

export class JournalDataEncounterItemAppearance {
    public difficulties: number[];
    public userHas: boolean;

    constructor(
        public appearanceId: number,
        public modifierId: number,
        difficulties: number[]
    ) {
        // if (xor([3, 4, 14], difficulties).length === 0) {
        //     // 10 normal + 25 normal + normal -> normal
        //     this.difficulties = [14];
        // } else if (xor([5, 6, 15], difficulties).length === 0) {
        //     // 10 heroic + 25 heroic + heroic -> heroic
        //     this.difficulties = [15];
        // } else {
        this.difficulties = difficulties;
        // }
    }
}

type JournalDataEncounterItemAppearanceArray = ConstructorParameters<
    typeof JournalDataEncounterItemAppearance
>;
