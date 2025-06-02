export class ManualDataSetCategory {
    public name: string;
    public slug: string;
    public groups: ManualDataSetGroup[];

    public constructor(name: string, slug: string, groups: ManualDataSetGroupArray[]) {
        this.name = name;
        this.slug = slug;
        this.groups = groups.map((groupArray) => new ManualDataSetGroup(...groupArray));
    }
}
export type ManualDataSetCategoryArray = ConstructorParameters<typeof ManualDataSetCategory>;

export class ManualDataSetGroup {
    constructor(
        public name: string,
        public things: number[][],
    ) {}
}
export type ManualDataSetGroupArray = ConstructorParameters<typeof ManualDataSetGroup>;
