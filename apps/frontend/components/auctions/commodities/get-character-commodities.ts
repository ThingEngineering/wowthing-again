import { ItemLocation } from '@/enums/item-location';
import type { UserData } from '@/types';

import type { CommodityData } from './store';
import { get } from 'svelte/store';
import { itemStore } from '@/stores';
import { ItemQuality } from '@/enums/item-quality';

export class CharacterCommodities {
    public itemCounts: Record<number, number> = {};
    public totalValue: number = 0;

    constructor(public characterId: number) {}

    public addCount(itemId: number, count: number) {
        this.itemCounts[itemId] = (this.itemCounts[itemId] || 0) + count;
    }
}

const locations: ItemLocation[] = [ItemLocation.Bags, ItemLocation.Bank, ItemLocation.Reagent];

const skippedIds = new Set<number>([
    108300, // Mithril Ore Nugget
    190452, // Primal Flux
    194784, // Glittering Parchment
]);

export function getCharacterCommodities(
    userData: UserData,
    commodities: CommodityData,
): CharacterCommodities[] {
    let ret: CharacterCommodities[] = [];

    const itemData = get(itemStore);

    for (const character of userData.characters) {
        const characterCommodities = new CharacterCommodities(character.id);
        const regionCommodities = commodities.regions[character.realm.region];

        for (const location of locations) {
            for (const characterItem of character.itemsByLocation[location] || []) {
                if (skippedIds.has(characterItem.itemId)) {
                    continue;
                }

                if (itemData.items[characterItem.itemId]?.quality === ItemQuality.Poor) {
                    continue;
                }

                const commodityPrice = regionCommodities[characterItem.itemId];
                if (!commodityPrice) {
                    continue;
                }

                characterCommodities.addCount(characterItem.itemId, characterItem.count);
                const itemValue = characterItem.count * (commodityPrice / 100);
                characterCommodities.totalValue += itemValue;
            }
        }

        ret.push(characterCommodities);
    }

    ret = ret.filter((cc) => cc.totalValue > 0);
    ret.sort((a, b) => b.totalValue - a.totalValue);

    return ret;
}
