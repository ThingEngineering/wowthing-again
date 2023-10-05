import type { InventoryType } from '@/enums/inventory-type'
import type { ItemClass } from '@/enums/item-class'


export type AuctionCategoryArray = [
    id: number,
    inventoryType: InventoryType,
    itemClass: ItemClass,
    itemSubClass: number,
    name: string,
    slug: string,
    childArrays: AuctionCategoryArray[]
]

export class AuctionCategory {
    public children: AuctionCategory[]

    constructor(
        public id: number,
        public inventoryType: InventoryType,
        public itemClass: ItemClass,
        public itemSubClass: number,
        public name: string,
        public slug: string,
        childArrays: AuctionCategoryArray[]
    )
    {
        this.children = (childArrays || []).map((childArray) => new AuctionCategory(...childArray))
    }

    get browseable(): boolean {
        return this.itemClass > 0 || this.inventoryType > 0
    }
}
// Can't use this and have it reference itself, alas
// export type AuctionCategoryArray = ConstructorParameters<typeof AuctionCategory>
