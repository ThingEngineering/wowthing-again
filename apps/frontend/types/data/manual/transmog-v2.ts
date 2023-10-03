import type { TransmogSetMatchType } from '@/enums/transmog-set-match-type'
import type { TransmogSetType } from '@/enums/transmog-set-type'


export class ManualDataTransmogSetCategory {
    public groups: ManualDataTransmogSetGroup[]

    public filteredGroups: ManualDataTransmogSetGroup[] = []

    constructor(
        public name: string,
        public slug: string,
        groupArrays: ManualDataTransmogSetGroupArray[],
        public skipClasses?: string[]
    )
    { 
        this.groups = groupArrays.map((groupArray) => new ManualDataTransmogSetGroup(...groupArray))
    }
}
export type ManualDataTransmogSetCategoryArray = ConstructorParameters<typeof ManualDataTransmogSetCategory>

export class ManualDataTransmogSetGroup {
    public bonusIds: Record<number, number[]>
    public setData: Array<Record<string, Record<number, ManualDataTransmogSetFiltered>>> = []
    public sets: ManualDataTransmogSetSet[]

    public filteredSets: ManualDataTransmogSetSet[] = []

    constructor(
        public type: TransmogSetType,
        public name: string,
        public matchType: TransmogSetMatchType,
        public matchTags: number[],
        setArrays: ManualDataTransmogSetSetArray[],
        public prefix?: string,
        bonusIdArrays?: [number, number[]][],
        public completionist?: boolean,
    )
    {
        this.bonusIds = {}
        for (const [modifier, bonusIds] of (bonusIdArrays || []))
        {
            this.bonusIds[modifier] = bonusIds
        }
        this.sets = setArrays.map((setArray) => new ManualDataTransmogSetSet(...setArray))
    }
}
export type ManualDataTransmogSetGroupArray = ConstructorParameters<typeof ManualDataTransmogSetGroup>

export class ManualDataTransmogSetSet {
    constructor(
        public type: TransmogSetType,
        public name: string,
        public matchTags: number[],
        public modifier?: number,
        public completionist?: boolean,
        public wowheadSetId?: number, // FIXME order
    )
    {}
}
export type ManualDataTransmogSetSetArray = ConstructorParameters<typeof ManualDataTransmogSetSet>

export interface ManualDataTransmogSetFiltered {
    sourceIds: string[]
}
