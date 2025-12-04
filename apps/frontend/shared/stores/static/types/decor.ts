export class StaticDataDecorCategory {
    public subCategories: StaticDataDecorSubcategory[];

    constructor(
        public id: number,
        public slug: string,
        public name: string,
        subCategoryArrays: StaticDataDecorSubcategoryArray[]
    ) {
        this.subCategories = subCategoryArrays.map((arr) => new StaticDataDecorSubcategory(...arr));
    }
}
export type StaticDataDecorCategoryArray = ConstructorParameters<typeof StaticDataDecorCategory>;

export class StaticDataDecorSubcategory {
    public objects: StaticDataDecorObject[];

    constructor(
        public id: number,
        public slug: string,
        public name: string,
        objectArrays: StaticDataDecorObjectArray[]
    ) {
        this.objects = objectArrays.map((arr) => new StaticDataDecorObject(...arr));
    }
}
export type StaticDataDecorSubcategoryArray = ConstructorParameters<
    typeof StaticDataDecorSubcategory
>;

export class StaticDataDecorObject {
    constructor(
        public id: number,
        public type: number,
        public itemId: number,
        public name: string
    ) {}
}
export type StaticDataDecorObjectArray = ConstructorParameters<typeof StaticDataDecorObject>;
