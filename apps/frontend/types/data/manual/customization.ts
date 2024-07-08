export class ManualDataCustomizationCategory {
    public groups: ManualDataCustomizationGroup[];

    constructor(
        public name: string,
        public slug: string,
        groupArrays: ManualDataCustomizationGroupArray[],
    ) {
        this.groups = groupArrays.map(
            (groupArray) => new ManualDataCustomizationGroup(...groupArray),
        );
    }
}
export type ManualDataCustomizationCategoryArray = ConstructorParameters<
    typeof ManualDataCustomizationCategory
>;

export class ManualDataCustomizationGroup {
    public things: ManualDataCustomizationThing[];

    constructor(
        public name: string,
        thingArrays: ManualDataCustomizationThingArray[],
    ) {
        this.things = thingArrays.map(
            (thingArray) => new ManualDataCustomizationThing(...thingArray),
        );
    }
}
export type ManualDataCustomizationGroupArray = ConstructorParameters<
    typeof ManualDataCustomizationGroup
>;

export class ManualDataCustomizationThing {
    constructor(
        public itemId: number,
        public achievementId: number,
        public questId: number,
        public appearanceModifier: number,
        public name: string,
    ) {}
}
export type ManualDataCustomizationThingArray = ConstructorParameters<
    typeof ManualDataCustomizationThing
>;
