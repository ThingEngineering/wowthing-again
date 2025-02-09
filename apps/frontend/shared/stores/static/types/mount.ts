export class StaticDataMount {
    constructor(
        public id: number,
        public sourceType: number,
        public spellId: number,
        public name: string,
        public itemIds: number[],
    )
    {}
}
export type StaticDataMountArray = ConstructorParameters<typeof StaticDataMount>
