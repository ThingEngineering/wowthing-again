export class StaticDataItem {
    constructor(
        public id: number,
        public appearanceId: number,
        public name: string
    )
    { }
}

export type StaticDataItemArray = ConstructorParameters<typeof StaticDataItem>
