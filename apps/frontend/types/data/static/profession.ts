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
}

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
export type StaticDataProfessionCategoryArray = ConstructorParameters<typeof StaticDataProfessionCategory>

export class StaticDataProfessionAbility {
    constructor(
        public id: number,
        public spellId: number,
        public skillups: number,
        public minSkill: number,
        public trivialLow: number,
        public trivialHigh: number,
        public name: string,
        public extraRanks?: [number, number][]
    )
    { }
}
export type StaticDataProfessionAbilityArray = ConstructorParameters<typeof StaticDataProfessionAbility>
