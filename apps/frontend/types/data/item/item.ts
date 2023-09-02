import { ItemFlags, type BindType, type InventoryType, type ItemQuality, type PrimaryStat } from '@/enums'
import type { ItemData } from './store'


export class ItemDataItem {
    private appearanceArrays?: ItemDataItemAppearanceArray[]

    constructor(
        public id: number,
        public name: string,
        public classMask: number,
        public raceMask: number,
        public classId: number,
        public subclassId: number,
        public inventoryType: InventoryType,
        idDiff: number,
        nameIndex: number,
        classMaskIndex: number,
        raceMaskIndex: number,
        classIdSubclassIdInventoryType: number,
        // public stackable: number,
        public quality: ItemQuality,
        // public primaryStat: PrimaryStat,
        public flags: number,
        public expansion: number,
        public itemLevel: number,
        // public requiredLevel: number,
        public bindType: BindType,
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

    get allianceOnly(): boolean {
        return (this.flags & ItemFlags.AllianceOnly) > 0
    }
    get hordeOnly(): boolean {
        return (this.flags & ItemFlags.HordeOnly) > 0
    }
}
// Can't use the auto type as we use array indexes for name/classMask/raceMask
// export type ItemDataItemArray = ConstructorParameters<typeof ItemDataItem>
export type ItemDataItemArray = [
    id: number,
    name: number,
    classMask: number,
    raceMask: number,
    classIdSubclassIdInventoryType: number,
    // stackable: number,
    quality: ItemQuality,
    // primaryStat: PrimaryStat,
    flags: number,
    expansion: number,
    itemLevel: number,
    // requiredLevel: number,
    bindType: BindType,
    appearanceArrays?: ItemDataItemAppearanceArray[]
]

export class ItemDataItemAppearance {
    public modifier: number
    constructor(
        public appearanceId: number,
        public sourceType: number,
        modifier?: number
    )
    {
        this.modifier = modifier || 0
    }
}
export type ItemDataItemAppearanceArray = ConstructorParameters<typeof ItemDataItemAppearance>
