export class CharacterEquippedItem {
    constructor(
        public context: number,
        public craftedQuality: number,
        public itemId: number,
        public itemLevel: number,
        public quality: number,
        public bonusIds: number[],
        public enchantmentIds: number[],
        public gemIds: number[],
    ) {}

    get count(): number {
        return 1;
    }
}
export type CharacterEquippedItemArray = ConstructorParameters<typeof CharacterEquippedItem>;
