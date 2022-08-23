import type { InventoryType, ItemQuality, PrimaryStat } from '@/types/enums'


export class ItemDataItem {
    public appearances: Record<number, ItemDataItemAppearance>

    constructor(
        public id: number,
        public classMask: number,
        public raceMask: number,
        public stackable: number,
        public classId: number,
        public subclassId: number,
        public inventoryType: InventoryType,
        public containerSlots: number,
        public quality: ItemQuality,
        public primaryStat: PrimaryStat,
        public flags: number,
        public expansion: number,
        public itemLevel: number,
        public requiredLevel: number,
        public name: string,
        appearanceArrays?: ItemDataItemAppearanceArray[]
    )
    {
        this.appearances = {}
        for (const appearanceArray of (appearanceArrays || [])) {
            const appearance = new ItemDataItemAppearance(...appearanceArray)
            this.appearances[appearance.modifier] = appearance
        }
    }
}
export type ItemDataItemArray = ConstructorParameters<typeof ItemDataItem>

export class ItemDataItemAppearance {
    constructor(
        public modifier: number,
        public appearanceId: number,
        public sourceType: number
    )
    {}
}
export type ItemDataItemAppearanceArray = ConstructorParameters<typeof ItemDataItemAppearance>
