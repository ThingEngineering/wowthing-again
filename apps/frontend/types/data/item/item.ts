import type { BindType, InventoryType, ItemQuality, PrimaryStat } from '@/enums'


export class ItemDataItem {
    private appearanceArrays?: ItemDataItemAppearanceArray[]

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
        public bindType: BindType,
        public name: string,
        appearanceArrays?: ItemDataItemAppearanceArray[]
    )
    {
        this.appearanceArrays = appearanceArrays || []
    }

    private _appearances: Record<number, ItemDataItemAppearance>
    get appearances(): Record<number, ItemDataItemAppearance> {
        if (this._appearances === undefined) {
            this._appearances = {}
            for (const appearanceArray of this.appearanceArrays) {
                const appearance = new ItemDataItemAppearance(...appearanceArray)
                this._appearances[appearance.modifier] = appearance
            }
            this.appearanceArrays = null
        }
        return this._appearances
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
