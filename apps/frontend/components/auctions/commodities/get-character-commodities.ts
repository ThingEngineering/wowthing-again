import { Constants } from '@/data/constants';
import { ItemLocation } from '@/enums/item-location';
import { ItemQuality } from '@/enums/item-quality';
import { wowthingData } from '@/shared/stores/data';
import { userState } from '@/user-home/state/user';

import type { CommodityData } from './store';

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
    commodities: CommodityData,
    currentExpansionOnly: boolean
): CharacterCommodities[] {
    let ret: CharacterCommodities[] = [];

    for (const character of userState.general.activeCharacters) {
        const characterCommodities = new CharacterCommodities(character.id);
        const regionCommodities = commodities.regions[character.realm.region];

        for (const location of locations) {
            for (const characterItem of character.itemsByLocation[location]) {
                if (skippedIds.has(characterItem.itemId)) {
                    continue;
                }

                const item = wowthingData.items.items[characterItem.itemId];
                if (!item) {
                    continue;
                }

                if (item.quality === ItemQuality.Poor) {
                    continue;
                }

                if (currentExpansionOnly && item.expansion !== Constants.expansion) {
                    continue;
                }

                const commodityPrice = regionCommodities[characterItem.itemId];
                if (!commodityPrice) {
                    continue;
                }

                const itemValue = characterItem.count * (commodityPrice / 100);
                if (itemValue >= 100) {
                    characterCommodities.addCount(characterItem.itemId, characterItem.count);
                    characterCommodities.totalValue += itemValue;
                }
            }
        }

        ret.push(characterCommodities);
    }

    ret = ret.filter((cc) => cc.totalValue > 0);
    ret.sort((a, b) => b.totalValue - a.totalValue);

    return ret;
}
