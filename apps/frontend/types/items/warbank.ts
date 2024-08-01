import type { ItemQuality } from '@/enums/item-quality';
import type { Region } from '@/enums/region';

export class WarbankItem /*implements UserItem*/ {
    public bonusIds: number[];
    public enchantmentIds: number[];
    public gemIds: number[];

    constructor(
        public region: Region,
        public bagId: number,
        public slot: number,
        public itemId: number,
        public count: number,
        public context: number,
        public craftedQuality: number,
        enchantId: number,
        public itemLevel: number,
        public quality: ItemQuality,
        public suffix: number,
        bonusIds?: number[],
        gemIds?: number[],
    ) {
        this.enchantmentIds = enchantId ? [enchantId] : [];
        this.bonusIds = bonusIds || [];
        this.gemIds = gemIds || [];
    }
}

export type WarbankItemArray = ConstructorParameters<typeof WarbankItem>;
