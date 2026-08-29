import { wowthingData } from '@/shared/stores/data';
import { applyBonusIds } from '@/utils/items/apply-bonus-ids';

export class CharacterEquippedItem {
    private _itemLevel: number;

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
        this._itemLevel = itemLevel;

        this.bonusIds.sort((a, b) => a - b);
    }

    get count(): number {
        return 1;
    }

    get itemLevel(): number {
        // the addon API is returning 0 sometimes for random equipped items 🙄
        if (this._itemLevel === 0) {
            const item = wowthingData.items.items[this.itemId];
            if (!!item) {
                const calculatedItemLevel = applyBonusIds(this.bonusIds, {
                    quality: this.quality,
                });
                this._itemLevel = calculatedItemLevel.itemLevel;
            }
        }

        return this._itemLevel;
    }
}
export type CharacterEquippedItemArray = ConstructorParameters<typeof CharacterEquippedItem>;
