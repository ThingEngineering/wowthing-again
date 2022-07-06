export class StaticDataMount {
    constructor(
        public id: number,
        public sourceType: number,
        public itemId: number,
        public spellId: number,
        public name: string
    )
    {}
}
export type StaticDataMountArray = ConstructorParameters<typeof StaticDataMount>
