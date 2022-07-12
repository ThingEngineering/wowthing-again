export class ManualDataSharedItem {
    constructor(
        public id: number,
        public appearanceId: number,
        public name: string
    )
    { }
}

export type ManualDataSharedItemArray = ConstructorParameters<typeof ManualDataSharedItem>
