import { ItemLocation } from '@/enums/item-location'
import type { ItemQuality } from '@/enums/item-quality'
import type { UserItem } from '../shared'


export class GuildItem implements UserItem {
    public bonusIds: number[]
    public enchantmentIds: number[]
    public gemIds: number[]

    public appearanceId: number
    public appearanceModifier: number
    public appearanceSource: string

    constructor(
        public tabId: number,
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

    get location(): ItemLocation {
        return ItemLocation.GuildBank
    }

    get containerId(): number {
        return this.tabId
    }

    get containerName(): string {
        return `Tab ${this.tabId}`
    }
}
export type GuildItemArray = ConstructorParameters<typeof GuildItem>
