export class ManualDataIllusionGroup {
    public items: ManualDataIllusionItem[];

    constructor(
        public name: string,
        itemArrays: ManualDataIllusionItemArray[],
    ) {
        this.items = (itemArrays || []).map(
            (itemArray) => new ManualDataIllusionItem(...itemArray),
        );
    }
}
export type ManualDataIllusionGroupArray = ConstructorParameters<typeof ManualDataIllusionGroup>;

export class ManualDataIllusionItem {
    constructor(
        public enchantmentId: number,
        public classes?: number[],
    ) {}
}
export type ManualDataIllusionItemArray = ConstructorParameters<typeof ManualDataIllusionItem>;
