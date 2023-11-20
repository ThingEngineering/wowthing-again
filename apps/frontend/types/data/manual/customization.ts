export class ManualDataCustomizationCategory {
    public groups: ManualDataCustomizationGroup[]

    constructor(
        public name: string,
        public slug: string,
        groupArrays: ManualDataCustomizationGroupArray[],
        public skipClasses?: string[]
    )
    { 
        this.groups = groupArrays.map((groupArray) => new ManualDataCustomizationGroup(...groupArray))
    }
}
export type ManualDataCustomizationCategoryArray = ConstructorParameters<typeof ManualDataCustomizationCategory>

export class ManualDataCustomizationGroup {
    public things: ManualDataCustomizationThing[]

    constructor(
        public name: string,
        thingArrays: ManualDataCustomizationThingArray[]
    )
    {
        this.things = thingArrays.map((thingArray) => new ManualDataCustomizationThing(...thingArray))
    }
}
export type ManualDataCustomizationGroupArray = ConstructorParameters<typeof ManualDataCustomizationGroup>

export class ManualDataCustomizationThing {
    constructor(
        public name: string,
        public itemId: number,
        public questId: number
    )
    { }
}
export type ManualDataCustomizationThingArray = ConstructorParameters<typeof ManualDataCustomizationThing>
