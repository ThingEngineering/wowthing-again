import { browserState } from '@/shared/state/browser.svelte';
import { wowthingData } from '@/shared/stores/data';
import { ItemLocation } from '@/enums/item-location';
import { userState } from '@/user-home/state/user';
import type { SearchItemsResult } from './types';
import { bagSlots } from '@/data/bag-slots';

const MAX_ITEM_IDS = 1000;

export function searchItems(): SearchItemsResult {
    console.time('searchItems');

    const ret: SearchItemsResult = {
        tooManyItems: false,
        results: [],
    };
    const snapshot = $state.snapshot(browserState.current.itemsSearch);

    // \p{L} = letters, \p{N} = numbers
    const nameParts = snapshot.name.replace(/[^ \p{L}\p{N}]/gu, '').split(/\s+/);

    const itemIds = new Set<number>();
    if (nameParts.length > 0) {
        const nameRegexes = nameParts.map((s) => new RegExp(s, 'i'));
        let itemIdCount = 0;
        for (const item of Object.values(wowthingData.items.items)) {
            if (nameRegexes.every((regex) => item.name.match(regex))) {
                if (itemIdCount === MAX_ITEM_IDS) {
                    ret.tooManyItems = true;
                    break;
                }

                itemIds.add(item.id);
                itemIdCount++;
            }
        }
    }

    const locations = snapshot.locations.map((l) => parseInt(l));
    for (const location of locations) {
        switch (location) {
            case ItemLocation.Bags:
            case ItemLocation.Bank:
                for (const character of userState.general.activeCharacters) {
                    for (const charItem of character.itemsByLocation[location]) {
                        if (!!charItem && itemIds.has(charItem.itemId)) {
                            ret.results.push([location, character.id, charItem]);
                        }
                    }
                    // check for bag/bank items
                }
                break;

            case ItemLocation.Equipped:
                // TODO: equipped items should implement UserItem
                // for (const character of userState.general.activeCharacters) {
                //     for (const equippedItem of Object.values(character.equippedItems || {})) {
                //         if (!!equippedItem && itemIds.has(equippedItem.itemId)) {
                //             ret.results.push([location, character.id, equippedItem]);
                //         }
                //     }
                // }
                break;

            case ItemLocation.WarbandBank:
                for (const warbankItem of userState.general.warbankItems) {
                    if (itemIds.has(warbankItem.itemId)) {
                        ret.results.push([location, 0, warbankItem]);
                    }
                }
                break;

            case ItemLocation.GuildBank:
                for (const guild of Object.values(userState.general.guildById)) {
                    // check for guild bank items
                }
                break;
        }
    }

    // qualities are annoying because bonusIDs exist
    // const qualities = snapshot.qualities.map((q) => parseInt(q));

    console.timeEnd('searchItems');
    console.log(ret);

    return ret;
}
