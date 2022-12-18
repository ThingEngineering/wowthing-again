import type { TransmogSetType } from '@/enums'


export class ManualDataTransmogSetCategory {
    public groups: ManualDataTransmogSetGroup[]
    public sets: ManualDataTransmogSetSet[]

    public filteredGroups: ManualDataTransmogSetGroup[] = []
    public filteredSets: ManualDataTransmogSetSet[] = []

    constructor(
        public name: string,
        public slug: string,
        groupArrays: ManualDataTransmogSetGroupArray[],
        setArrays: ManualDataTransmogSetSetArray[],
        public skipClasses?: string[]
    )
    { 
        this.groups = groupArrays.map((groupArray) => new ManualDataTransmogSetGroup(...groupArray))
        this.sets = setArrays.map((setArray) => new ManualDataTransmogSetSet(...setArray))
    }
}
export type ManualDataTransmogSetCategoryArray = ConstructorParameters<typeof ManualDataTransmogSetCategory>

export class ManualDataTransmogSetGroup {
    public bonusIds: Record<number, number[]>
    public setData: Array<Record<string, Record<number, ManualDataTransmogSetFiltered>>> = []

    constructor(
        public type: TransmogSetType,
        public name: string,
        public matchTags: number[],
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
    }
}
export type ManualDataTransmogSetGroupArray = ConstructorParameters<typeof ManualDataTransmogSetGroup>

export class ManualDataTransmogSetSet {
    constructor(
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
