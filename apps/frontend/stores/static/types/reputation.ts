import type { RewardType } from '@/enums/reward-type'


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
    names: string[]
}

export class StaticDataReputationCategory {
    public reputations: StaticDataReputationSet[][]

    constructor(
        public name: string,
        public slug: string,
        reputationArrays: StaticDataReputationSetArray[][],
        public minimumLevel?: number
    )
    {
        this.reputations = reputationArrays
            .map((repGroup) => repGroup.map(
                (repSet) => new StaticDataReputationSet(...repSet)
            ))
    }
}
export type StaticDataReputationCategoryArray = ConstructorParameters<typeof StaticDataReputationCategory>

export class StaticDataReputationSet {
    public both: StaticDataReputationReputation
    public alliance: StaticDataReputationReputation
    public horde: StaticDataReputationReputation
    
    constructor(
        public major: boolean,
        public paragon: boolean,
        reputationArrays: StaticDataReputationReputationArray[]
    )
    {
        for (const reputationArray of reputationArrays) {
            const obj = new StaticDataReputationReputation(...reputationArray)
            if (reputationArray[0] === 'both') {
                this.both = obj
            }
            else if (reputationArray[0] === 'alliance') {
                this.alliance = obj
            }
            else if (reputationArray[0] === 'horde') {
                this.horde = obj
            }
        }
    }
}
export type StaticDataReputationSetArray = ConstructorParameters<typeof StaticDataReputationSet>

export class StaticDataReputationReputation {
    public rewards: StaticDataReputationReward[]

    constructor(
        key: string,
        public id: number,
        public icon: string,
        rewards: StaticDataReputationRewardArray[],
        public note?: string
    )
    {
        this.rewards = rewards.map((rewardArray) => new StaticDataReputationReward(...rewardArray))
    }
}
export type StaticDataReputationReputationArray = ConstructorParameters<typeof StaticDataReputationReputation>

export class StaticDataReputationReward {
    constructor(
        public type: RewardType,
        public id: number
    )
    { }
}
export type StaticDataReputationRewardArray = ConstructorParameters<typeof StaticDataReputationReward>
