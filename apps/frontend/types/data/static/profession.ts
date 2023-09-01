import type { Faction, SkillSourceType } from '@/enums'

export interface StaticDataProfession {
    id: number
    name: string
    slug: string
    type: number
    subProfessions: StaticDataSubProfession[]

    categories: StaticDataProfessionCategory[]
    rawCategories: StaticDataProfessionCategoryArray[]
}

export interface StaticDataSubProfession {
    id: number
    name: string
    traitTrees?: StaticDataSubProfessionTraitTree[]
}

export interface StaticDataSubProfessionTraitTree {
    id: number
    name: string
    firstNode: StaticDataSubProfessionTraitNode
}

export interface StaticDataSubProfessionTraitNode {
    name: string
    nodeId: number
    rankEntryId: number
    rankMax: number
    unlockEntryId: number

    children: StaticDataSubProfessionTraitNode[]
}

export type StaticDataProfessionCategoryArray = [
    id: number,
    order: number,
    name: string,
    childArrays: StaticDataProfessionCategoryArray[],
    abilityArrays: StaticDataProfessionAbilityArray[],
]

export class StaticDataProfessionCategory {
    public abilities: StaticDataProfessionAbility[]
    public children: StaticDataProfessionCategory[]

    constructor(
        public id: number,
        public order: number,
        public name: string,
        childArrays: StaticDataProfessionCategoryArray[],
        abilityArrays: StaticDataProfessionAbilityArray[]
    )
    {
        this.children = childArrays.map((childArray) => new StaticDataProfessionCategory(...childArray))
        this.abilities = abilityArrays.map((abilityArray) => new StaticDataProfessionAbility(...abilityArray))
    }
}
// Can't use this and have it reference itself, alas
// export type StaticDataProfessionCategoryArray = ConstructorParameters<typeof StaticDataProfessionCategory>

export class StaticDataProfessionAbility {
    constructor(
        public id: number,
        public spellId: number,
        public itemId: number,
        public firstCraftQuestId: number,
        public skillups: number,
        public minSkill: number,
        public trivialLow: number,
        public trivialHigh: number,
        public faction: Faction,
        public source: SkillSourceType,
        public name: string,
        public extraRanks?: [number, number][]
    )
    { }
}
export type StaticDataProfessionAbilityArray = ConstructorParameters<typeof StaticDataProfessionAbility>
