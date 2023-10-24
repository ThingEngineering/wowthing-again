export class DataItemSet {
    constructor(
        public id: number,
        public name: string,
        public itemIds: number[]
    )
    { }
}
export type DataItemSetArray = ConstructorParameters<typeof DataItemSet>
