import type { FarmStatus, UserCount } from '@/types'
import type { RewardType, FarmIdType, FarmResetType, FarmType } from '@/types/enums'


export interface ZoneMapData {
    sets: ZoneMapDataCategory[][]

    counts?: Record<string, UserCount>
    farmStatus?: Record<string, FarmStatus[]>
    typeCounts?: Record<string, Record<RewardType, UserCount>>
}

export interface ZoneMapDataCategory {
    minimumLevel: number
    mapName: string
    name: string
    slug: string
    wowheadGuide: string
    requiredQuestIds: number[]
    farms: ZoneMapDataFarm[]
    farmsRaw: ZoneMapDataFarmArray[]
}

export class ZoneMapDataFarm {
    public id: number
    public minimumLevel?: number
    public statisticId?: number
    public name: string
    public faction?: string
    public note?: string
    public idType: FarmIdType
    public reset: FarmResetType
    public type: FarmType
    public questIds: number[]
    public requiredQuestIds?: number[]
    public location: string[]
    public drops: ZoneMapDataDrop[]

    constructor(
        type: FarmType,
        reset: FarmResetType,
        idType: FarmIdType,
        id: number,
        name: string,
        location: string,
        questIds: number[],
        dropsRaw: ZoneMapDataDropArray[],
        minimumLevel?: number,
        statisticId?: number,
        requiredQuestIds?: number[],
        note?: string,
        faction?: string
    )
    {
        this.type = type
        this.reset = reset
        this.idType = idType
        this.id = id
        this.name = name
        this.location = location.split(',')
        this.questIds = questIds

        this.minimumLevel = minimumLevel
        this.statisticId = statisticId
        this.requiredQuestIds = requiredQuestIds
        this.note = note
        this.faction = faction

        this.drops = dropsRaw.map((dropArray) => new ZoneMapDataDrop(...dropArray))
    }
}

type ZoneMapDataFarmArray = ConstructorParameters<typeof ZoneMapDataFarm>

export class ZoneMapDataDrop {
    constructor(
        public id: number,
        public name: string,
        public type: RewardType,
        public subType: number,
        public classMask: number,
        public limit?: string[],
        public questIds?: number[],
        public requiredQuestId?: number,
        public note?: string
    )
    {}
}

type ZoneMapDataDropArray = ConstructorParameters<typeof ZoneMapDataDrop>
