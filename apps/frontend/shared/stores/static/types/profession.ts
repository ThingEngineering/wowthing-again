import type { Faction } from '@/enums/faction';
import type { SkillSourceType } from '@/enums/skill-source-type';

export class StaticDataProfession {
    public categories: StaticDataProfessionCategory[];
    public subProfessions: StaticDataSubProfession[];
    public expansionSubProfession: Record<number, StaticDataSubProfession>;
    public expansionCategory: Record<number, StaticDataProfessionCategory>;

    constructor(
        public id: number,
        public type: number,
        public name: string,
        public slug: string,
        rawCategories: StaticDataProfessionCategoryArray[],
        rawSubProfessions: StaticDataSubProfessionArray[]
    ) {
        this.categories = rawCategories.map(
            (categoryArray) => new StaticDataProfessionCategory(...categoryArray)
        );
        this.subProfessions = rawSubProfessions.map(
            (subProfessionArray) => new StaticDataSubProfession(...subProfessionArray)
        );

        this.expansionCategory = Object.fromEntries(
            this.categories.map((cat, index) => [index, cat])
        );
        this.expansionSubProfession = Object.fromEntries(
            this.subProfessions.map((cat, index) => [index, cat])
        );
    }
}
export type StaticDataProfessionArray = ConstructorParameters<typeof StaticDataProfession>;

export class StaticDataSubProfession {
    public traitTrees: StaticDataSubProfessionTraitTree[];

    constructor(
        public id: number,
        public name: string,
        rawTraitTrees: StaticDataSubProfessionTraitTreeArray[]
    ) {
        this.traitTrees = rawTraitTrees.map(
            (traitTreeArray) => new StaticDataSubProfessionTraitTree(...traitTreeArray)
        );
    }
}
type StaticDataSubProfessionArray = ConstructorParameters<typeof StaticDataSubProfession>;

export class StaticDataSubProfessionTraitTree {
    public firstNode: StaticDataSubProfessionTraitNode;

    constructor(
        public id: number,
        rawFirstNode: StaticDataSubProfessionTraitNodeArray
    ) {
        this.firstNode = new StaticDataSubProfessionTraitNode(...rawFirstNode);
    }
}
type StaticDataSubProfessionTraitTreeArray = ConstructorParameters<
    typeof StaticDataSubProfessionTraitTree
>;

export class StaticDataSubProfessionPerk {
    constructor(
        public nodeId: number,
        public maxRank: number,
        public description: string
    ) {}
}
type StaticDataSubProfessionPerkArray = ConstructorParameters<typeof StaticDataSubProfessionPerk>;

type StaticDataSubProfessionTraitNodeArray = [
    nodeId: number,
    rankEntryId: number,
    rankMax: number,
    unlockEntryId: number,
    name: string,
    perkArrays: StaticDataSubProfessionPerkArray[],
    childArrays: StaticDataSubProfessionTraitNodeArray[],
];
export class StaticDataSubProfessionTraitNode {
    public children: StaticDataSubProfessionTraitNode[];
    public perks: StaticDataSubProfessionPerk[];

    constructor(
        public nodeId: number,
        public rankEntryId: number,
        public rankMax: number,
        public unlockEntryId: number,
        public name: string,
        perkArrays: StaticDataSubProfessionPerkArray[],
        childArrays: StaticDataSubProfessionTraitNodeArray[]
    ) {
        this.perks = perkArrays.map((perkArray) => new StaticDataSubProfessionPerk(...perkArray));
        this.children = childArrays.map(
            (childArray) => new StaticDataSubProfessionTraitNode(...childArray)
        );
    }
}
// Can't use this and have it reference itself, alas
//type StaticDataSubProfessionTraitNodeArray = ConstructorParameters<typeof StaticDataSubProfessionTraitNode>;

export type StaticDataProfessionCategoryArray = [
    id: number,
    order: number,
    name: string,
    childArrays: StaticDataProfessionCategoryArray[],
    abilityArrays: StaticDataProfessionAbilityArray[],
];

export class StaticDataProfessionCategory {
    public abilities: StaticDataProfessionAbility[];
    public children: StaticDataProfessionCategory[];

    constructor(
        public id: number,
        public order: number,
        public name: string,
        childArrays: StaticDataProfessionCategoryArray[],
        abilityArrays: StaticDataProfessionAbilityArray[]
    ) {
        this.children = childArrays.map(
            (childArray) => new StaticDataProfessionCategory(...childArray)
        );
        this.abilities = abilityArrays.map(
            (abilityArray) => new StaticDataProfessionAbility(...abilityArray)
        );
    }
}
// Can't use this and have it reference itself, alas
// export type StaticDataProfessionCategoryArray = ConstructorParameters<typeof StaticDataProfessionCategory>

export class StaticDataProfessionAbility {
    public itemIds: number[];
    public categoryReagents: StaticDataProfessionCategoryReagent[];

    constructor(
        public id: number,
        public spellId: number,
        itemId: number | number[],
        public firstCraftQuestId: number,
        public skillups: number,
        public minSkill: number,
        public trivialLow: number,
        public trivialHigh: number,
        public faction: Faction,
        public source: SkillSourceType,
        public name: string,
        categoryReagentArrays: StaticDataProfessionReagentArray[],
        public itemReagents: [number, number][],
        public extraRanks?: [number, number][]
    ) {
        this.itemIds = typeof itemId === 'number' ? [itemId] : itemId;
        this.categoryReagents = categoryReagentArrays.map(
            (reagentArray) => new StaticDataProfessionCategoryReagent(...reagentArray)
        );
    }
}
export type StaticDataProfessionAbilityArray = ConstructorParameters<
    typeof StaticDataProfessionAbility
>;

export class StaticDataProfessionAbilityInfo {
    constructor(
        public professionId: number,
        public subProfessionId: number,
        public ability: StaticDataProfessionAbility,
        public abilityId: number,
        public itemIds: number[],
        public spellId: number
    ) {}
}

export class StaticDataProfessionCategoryReagent {
    constructor(
        public count: number,
        public categoryIds: number[]
    ) {}
}
export type StaticDataProfessionReagentArray = ConstructorParameters<
    typeof StaticDataProfessionCategoryReagent
>;
