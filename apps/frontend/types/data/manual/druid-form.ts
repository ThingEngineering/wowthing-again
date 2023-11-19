export class ManualDataDruidFormGroup {
    public items: ManualDataDruidFormGroupItem[]

    constructor(
        public name: string,
        itemArrays: ManualDataDruidFormGroupItemArray[]
    )
    {
        this.items = itemArrays.map((itemArray) => new ManualDataDruidFormGroupItem(...itemArray))
    }
}
export type ManualDataDruidFormGroupArray = ConstructorParameters<typeof ManualDataDruidFormGroup>

export class ManualDataDruidFormGroupItem {
    constructor(
        public itemId: number,
        public questId: number,
    ) { }
}
export type ManualDataDruidFormGroupItemArray = ConstructorParameters<typeof ManualDataDruidFormGroupItem>
