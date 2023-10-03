import type { ItemLocation } from '@/enums/item-location'
import type { ItemQuality } from '@/enums/item-quality'
import type { UserItem } from '../shared'


export class CharacterItem implements UserItem {
    public bonusIds: number[]
    public enchantmentIds: number[]
    public gemIds: number[]

    public appearanceId: number
    public appearanceModifier: number
    public appearanceSource: string

    constructor(
        public location: ItemLocation,
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
        gemIds?: number[]
    ) {
        this.enchantmentIds = enchantId ? [enchantId] : []
        this.bonusIds = bonusIds || []
        this.gemIds = gemIds || []
    }

    get containerId(): number {
        return this.bagId
    }

    get containerName(): string {
        if (this.bagId === 0) {
            return 'Backpack'
        }
        else {
            return `Bag ${this.bagId}`
        }
    }
}
export type CharacterItemArray = ConstructorParameters<typeof CharacterItem>
