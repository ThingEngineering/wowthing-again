import { InventoryType } from '@/enums/inventory-type'

export const typeOrder: InventoryType[] = [
    InventoryType.MainHand,
    InventoryType.OffHand,
    InventoryType.Head,
    InventoryType.Neck,
    InventoryType.Shoulders,
    InventoryType.Back,
    InventoryType.Chest,
    InventoryType.Chest2,
    InventoryType.Tabard,
    InventoryType.Wrist,
    InventoryType.Hands,
    InventoryType.Waist,
    InventoryType.Legs,
    InventoryType.Feet,
    InventoryType.Finger,
    InventoryType.Trinket,
]

export const typeOrderMap: Record<number, number> = Object.fromEntries(
    typeOrder.map((type, index) => [type, index])
)
