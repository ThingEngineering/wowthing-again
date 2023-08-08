import { ItemLocation, type ItemQuality } from '@/enums'
import type { UserItem } from '../shared'


export class GuildItem implements UserItem {
    public bonusIds: number[]
    public gems: number[]

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
        public enchantId: number,
        public itemLevel: number,
        public quality: ItemQuality,
        public suffix: number,
        bonusIds?: number[],
        gems?: number[]
    ) {
        this.bonusIds = bonusIds || []
        this.gems = gems || []
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
