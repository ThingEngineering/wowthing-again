import type { InventoryType, ItemQuality } from '@/types/enums'


export class ManualDataSharedItem {
    public appearanceIds: Record<number, number>

    constructor(
        public id: number,
        public inventoryType: InventoryType,
        public quality: ItemQuality,
        appearanceIds: number[][],
        public name: string
    )
    {
        this.appearanceIds = {}
        for (const [modifier, appearanceId] of (appearanceIds || [])) {
            this.appearanceIds[modifier] = appearanceId
        }
    }
}

export type ManualDataSharedItemArray = ConstructorParameters<typeof ManualDataSharedItem>
