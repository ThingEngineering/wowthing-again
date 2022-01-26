export class StaticDataReputation {
    constructor(
        public id: number,
        public tierId: number,
        public name: string
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
    name: string
    reputations: StaticDataReputationSet[][]
    slug: string
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
    name: string
    type: string
}
