import type { InventoryType } from '@/enums/inventory-type';
import type {
    ItemDataItemArray,
    DataItemBonusArray,
    DataItemSetArray,
    ItemDataItem,
    DataItemBonus,
    DataItemSet,
} from '@/types/data/item';
import type { DataItemModifiedCrafting } from '@/types/data/item/modified-crafting';

export interface RawItems {
    classIdSubclassIdInventoryTypes: [number, number, number][];
    classMasks: number[];
    names: string[];
    oppositeFactionIds: number[];
    raceMasks: number[];

    appearanceMap: Record<number, number>;
    bonusIdToModifiedCrafting: Record<number, DataItemModifiedCrafting>;
    completesQuest: Record<number, number[]>;
    craftingQualities: Record<number, number[]>;
    itemBonusListGroups: Record<number, Record<number, number[]>>;
    itemConversionEntries: Record<number, number[]>;
    limitCategories: Record<number, number>;
    limitCategoryItems: Record<number, number[]>;
    specOverrides: Record<number, number[]>;
    teachesSpell: Record<number, number[]>;
    teachesTransmog: Record<number, number>;

    rawItems: ItemDataItemArray[];
    rawItemBonuses: DataItemBonusArray[];
    rawItemSets: DataItemSetArray[];
}

export class DataItems {
    public appearanceMap: RawItems['appearanceMap'];
    public bonusIdToModifiedCrafting: RawItems['bonusIdToModifiedCrafting'];
    public completesQuest: RawItems['completesQuest'];
    public itemConversionEntries: RawItems['itemConversionEntries'];
    public limitCategories: RawItems['limitCategories'];
    public specOverrides: RawItems['specOverrides'];
    public teachesSpell: RawItems['teachesSpell'];
    public teachesTransmog: RawItems['teachesTransmog'];

    public appearanceToItems: Record<number, [number, number][]> = {};
    public items: Record<number, ItemDataItem> = {};
    public itemBonuses: Record<number, DataItemBonus> = {};
    public itemBonusCurrentSeason: Set<number> = new Set();
    public itemBonusSocket: Set<number> = new Set();
    public itemBonusSpeed: Set<number> = new Set();
    public itemBonusToUpgrade: Record<number, [number, number, number]> = {};
    public itemConversionBonus: Record<number, number> = {};
    public itemSets: Record<number, DataItemSet> = {};
    public openableItemIds: Set<number> = new Set();
    public oppositeFactionAppearance: Record<number, number[]>;
    public transmogSetToItems: Record<number, number[]> = {};

    public currentTier: Record<number, InventoryType>;
    public previousTier: Record<number, InventoryType>;
}
