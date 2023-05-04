export class ManualDataHeirloomGroup {
    public items: ManualDataHeirloomItem[]

    constructor(
        public name: string,
        itemArrays: ManualDataHeirloomItemArray[]
    )
    {
        this.items = (itemArrays || []).map((itemArray) => new ManualDataHeirloomItem(...itemArray))
    }
}
export type ManualDataHeirloomGroupArray = ConstructorParameters<typeof ManualDataHeirloomGroup>

export class ManualDataHeirloomItem {
    constructor(
        public itemId: number,
        public faction?: string
    )
    { }
}
export type ManualDataHeirloomItemArray = ConstructorParameters<typeof ManualDataHeirloomItem>
