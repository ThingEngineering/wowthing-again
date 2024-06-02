import { InventoryType } from '@/enums/inventory-type';

export function fixedInventoryType(type: InventoryType): InventoryType {
    return type === InventoryType.Chest2 ? InventoryType.Chest : type;
}
