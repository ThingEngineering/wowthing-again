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
    public setData: Array<Record<string, Record<number, ManualDataTransmogSetFiltered>>> = []

    constructor(
        public type: TransmogSetType,
        public name: string,
        public matchTags: number[],
        public prefix?: string,
        public completionist?: boolean,
    )
    {}
}
export type ManualDataTransmogSetGroupArray = ConstructorParameters<typeof ManualDataTransmogSetGroup>

export class ManualDataTransmogSetSet {
    constructor(
        public name: string,
        public matchTags: number[],
        public completionist?: boolean,
        public wowheadSetId?: number, // FIXME order
    )
    {}
}
export type ManualDataTransmogSetSetArray = ConstructorParameters<typeof ManualDataTransmogSetSet>

export interface ManualDataTransmogSetFiltered {
    sourceIds: string[]
}
