import { ItemFlags } from '@/enums/item-flags';
import type { BindType } from '@/enums/bind-type';
import type { InventoryType } from '@/enums/inventory-type';
import type { ItemQuality } from '@/enums/item-quality';
import type { PrimaryStat } from '@/enums/primary-stat';

export class ItemDataItem {
    public craftingQuality?: number;
    public limitCategory?: number;
    public oppositeFactionId?: number;

    private appearanceArrays?: ItemDataItemAppearanceArray[];

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
        public primaryStat: PrimaryStat,
        public flags: number,
        public expansion: number,
        public itemLevel: number,
        // public requiredLevel: number,
        public bindType: BindType,
        public unique: number,
        public socketTypes: number[],
        appearanceArrays?: ItemDataItemAppearanceArray[],
    ) {
        this.appearanceArrays = appearanceArrays || [];
    }

    private _appearances: Record<number, ItemDataItemAppearance>;
    get appearances(): Record<number, ItemDataItemAppearance> {
        if (this._appearances === undefined) {
            this._appearances = {};
            for (const appearanceArray of this.appearanceArrays) {
                const appearance = new ItemDataItemAppearance(...appearanceArray);
                this._appearances[appearance.modifier] = appearance;
            }
            this.appearanceArrays = null;
        }
        return this._appearances;
    }

    get cosmetic(): boolean {
        return (this.flags & ItemFlags.Cosmetic) > 0;
    }
    get allianceOnly(): boolean {
        return (this.flags & ItemFlags.AllianceOnly) > 0;
    }
    get hordeOnly(): boolean {
        return (this.flags & ItemFlags.HordeOnly) > 0;
    }
    get difficultyLookingForRaid(): boolean {
        return (this.flags & ItemFlags.LookingForRaidDifficulty) > 0;
    }
    get difficultyHeroic(): boolean {
        return (this.flags & ItemFlags.HeroicDifficulty) > 0;
    }
    get difficultyMythic(): boolean {
        return (this.flags & ItemFlags.MythicDifficulty) > 0;
    }
    get equippable(): boolean {
        return this.classId === 2 || this.classId === 4;
    }
    get key(): string {
        return this.id.toString();
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
    primaryStat: PrimaryStat,
    flags: number,
    expansion: number,
    itemLevel: number,
    // requiredLevel: number,
    bindType: BindType,
    unique: number,
    appearanceArrays?: ItemDataItemAppearanceArray[],
];

export class ItemDataItemAppearance {
    public modifier: number;
    constructor(
        public appearanceId: number,
        public sourceType: number,
        modifier?: number,
    ) {
        this.modifier = modifier || 0;
    }
}
export type ItemDataItemAppearanceArray = ConstructorParameters<typeof ItemDataItemAppearance>;
