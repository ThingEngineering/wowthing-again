import type { ItemLocation, ItemQuality } from '@/enums'
import type { UserItem } from '../shared'


export class CharacterItem implements UserItem {
    public bonusIds: number[]
    public gems: number[]

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
