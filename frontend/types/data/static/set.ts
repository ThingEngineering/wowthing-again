export class StaticDataSetCategory {
    public name: string
    public slug: string
    public groups: StaticDataSetGroup[]

    public constructor(
        name: string,
        slug: string,
        groups: StaticDataSetGroupArray[]
    )
    {
        this.name = name
        this.slug = slug
        this.groups = groups.map((groupArray) => new StaticDataSetGroup(...groupArray))
    }
}
export type StaticDataSetCategoryArray = ConstructorParameters<typeof StaticDataSetCategory>

export class StaticDataSetGroup {
    constructor(
        public name: string,
        public things: number[][]
    )
    { }
}
export type StaticDataSetGroupArray = ConstructorParameters<typeof StaticDataSetGroup>
