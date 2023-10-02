import type { InventoryType, ItemClass, ItemQuality } from '@/enums'


export type AuctionCategoryArray = [
    id: number,
    inventoryType: InventoryType,
    itemClass: ItemClass,
    itemSubClass: number,
    description: string,
    childArrays: AuctionCategoryArray[]
]

export class AuctionCategory {
    public children: AuctionCategory[]

    constructor(
        public id: number,
        public inventoryType: InventoryType,
        public itemClass: ItemClass,
        public itemSubClass: number,
        public description: string,
        childArrays: AuctionCategoryArray[]
    )
    {
        this.children = childArrays.map((childArray) => new AuctionCategory(...childArray))
    }
}
// Can't use this and have it reference itself, alas
// export type AuctionCategoryArray = ConstructorParameters<typeof AuctionCategory>
