import type { BindType } from '@/enums/bind-type';
import type { ItemLocation } from '@/enums/item-location';
import type { ItemQuality } from '@/enums/item-quality';
import type { Region } from '@/enums/region';

export interface ItemSearchResponseItem {
    itemId: number;
    itemName: string;
    characters: ItemSearchResponseCharacter[];
    equipped: ItemSearchResponseCharacter[];
    guildBanks: ItemSearchResponseGuildBank[];
    warbank: ItemSearchResponseWarbank[];
}

export interface ItemSearchResponseCommon {
    bindType: BindType;
    bound: boolean;
    count: number;
    itemLevel: number;
    quality: ItemQuality;
    context?: number;
    enchantId?: number;
    suffixId?: number;
    bonusIds?: number[];
    gems?: number[];
}

export interface ItemSearchResponseCharacter extends ItemSearchResponseCommon {
    characterId: number;
    location: ItemLocation;
}

export interface ItemSearchResponseGuildBank extends ItemSearchResponseCommon {
    guildId: number;
    tab: number;
    slot: number;
}

export interface ItemSearchResponseWarbank extends ItemSearchResponseCommon {
    region: Region;
    tab: number;
    slot: number;
}
