export class StaticDataReputation {
    constructor(
        public id: number,
        public expansion: number,
        public tierId: number,
        public parentId: number,
        public paragonId: number,
        public name: string,
        public description?: string
    )
    { }
}
export type StaticDataReputationArray = ConstructorParameters<typeof StaticDataReputation>

export interface StaticDataReputationTier {
    id: number
    minValues: number[]
    maxValues: number[]
    names: string[]
}

export interface StaticDataReputationCategory {
    minimumLevel?: number
    name: string
    slug: string
    reputations: StaticDataReputationSet[][]
}

export interface StaticDataReputationSet {
    both: StaticDataReputationReputation
    alliance: StaticDataReputationReputation
    horde: StaticDataReputationReputation
    paragon: boolean
}

export interface StaticDataReputationReputation {
    id: number
    icon: string
    note: string
    rewards: StaticDataReputationReward[]
}

export interface StaticDataReputationReward {
    id: number
    type: string
}
