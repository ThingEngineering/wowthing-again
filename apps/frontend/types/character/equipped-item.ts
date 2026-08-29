import { applyBonusIds } from '@/utils/items/apply-bonus-ids';

export class CharacterEquippedItem {
    #itemLevel?: number;

    constructor(
        public context: number,
        public craftedQuality: number,
        public itemId: number,
        itemLevel: number,
        public quality: number,
        public bonusIds: number[],
        public enchantmentIds: number[],
        public gemIds: number[]
    ) {
        this.#itemLevel = itemLevel;

        this.bonusIds.sort((a, b) => a - b);
    }

    get count(): number {
        return 1;
    }

    get itemLevel(): number {
        // the addon API is returning 0 sometimes for random equipped items 🙄
        if (this.#itemLevel === 0) {
            const calculatedItemLevel = applyBonusIds(this.bonusIds, {
                quality: this.quality,
            });
            this.#itemLevel = calculatedItemLevel.itemLevel;
        }

        return this.#itemLevel;
    }
}
export type CharacterEquippedItemArray = ConstructorParameters<typeof CharacterEquippedItem>;
