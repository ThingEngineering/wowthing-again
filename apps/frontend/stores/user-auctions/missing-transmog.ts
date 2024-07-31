import { extraCraftedItemIds } from '@/data/auctions';
import { InventoryType } from '@/enums/inventory-type';
import { ItemClass } from '@/enums/item-class';
import { ItemFlags } from '@/enums/item-flags';
import { WeaponSubclass } from '@/enums/weapon-subclass';
import { sortAuctions, type SortableAuction } from '@/utils/auctions/sort-auctions';
import getTransmogClassMask from '@/utils/get-transmog-class-mask';
import {
    type UserAuctionDataMissingTransmogAuctionArray,
    UserAuctionDataMissingTransmogAuction,
} from '@/types/data';
import type { ItemData } from '@/types/data/item';
import type { StaticData } from '@/shared/stores/static/types';
import type { UserData } from '@/types';
import type { Settings } from '@/shared/stores/settings/types';

import type { AuctionState } from '../local-storage';
import type { UserAuctionEntry } from '../user-auctions';

export class UserAuctionMissingTransmogDataStore {
    private static url = '/api/auctions/missing-appearance-';
    private cache: Record<string, [UserAuctionEntry[], Record<number, number>]> = {};

    async search(
        settings: Settings,
        auctionState: AuctionState,
        itemData: ItemData,
        staticData: StaticData,
        userData: UserData,
        searchType: string,
    ): Promise<[UserAuctionEntry[], Record<number, number>]> {
        let things: UserAuctionEntry[] = [];
        let updated: Record<number, number>;

        const cacheKey = [
            auctionState.region,
            auctionState.allRealms ? '1' : '0',
            auctionState.includeRussia ? '1' : '0',
            searchType,
        ].join('--');

        if (this.cache[cacheKey]) {
            [things, updated] = this.cache[cacheKey];
        } else {
            const region = parseInt(auctionState.region) || 0;
            const data = {
                allRealms: auctionState.allRealms,
                includeRussia: region === 3 ? auctionState.includeRussia : false,
                region,
            };

            const xsrf = document.getElementById('app').getAttribute('data-xsrf');

            const response = await fetch(UserAuctionMissingTransmogDataStore.url + searchType, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    RequestVerificationToken: xsrf,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = (await response.json()) as {
                    auctions: Record<string, UserAuctionDataMissingTransmogAuctionArray[]>;
                    updated: Record<number, number>;
                };
                updated = responseData.updated;

                const parsedData: Record<string, UserAuctionDataMissingTransmogAuction[]> = {};
                for (const [auctionKey, rawAuctions] of Object.entries(responseData.auctions)) {
                    parsedData[auctionKey] = rawAuctions.map(
                        (auctionArray) =>
                            new UserAuctionDataMissingTransmogAuction(...auctionArray),
                    );
                }

                for (const [thingId, auctions] of Object.entries(parsedData)) {
                    if (thingId === '0') {
                        continue;
                    }

                    const item = itemData.items[auctions[0].itemId];
                    if (!item) {
                        continue;
                    }

                    things.push({
                        id: thingId,
                        name: item.name,
                        auctions,
                        hasItems:
                            searchType === 'ids'
                                ? userData.itemsByAppearanceId[parseInt(thingId)] || []
                                : userData.itemsByAppearanceSource[thingId] || [],
                    });
                }
            }
        }

        things = sortAuctions(
            auctionState.sortBy[`missing-appearance-${searchType}`],
            things as SortableAuction[],
            true,
        ) as UserAuctionEntry[];
        this.cache[cacheKey] = [things, updated];

        const classMask = getTransmogClassMask(settings);
        const maxGold =
            (parseInt(auctionState.missingTransmogMaxGold.replace(/[,.]/g, '')) || 0) * 10000;
        const nameLower = auctionState.missingTransmogNameSearch.toLocaleLowerCase();
        const realmLower = auctionState.missingTransmogRealmSearch.toLocaleLowerCase();
        things = things.filter((thing) => {
            const item = itemData.items[thing.auctions[0].itemId];
            if (classMask && item.classMask && (item.classMask & classMask) === 0) {
                return false;
            }

            if ((item.flags & ItemFlags.CannotTransmogToThisItem) > 0) {
                return false;
            }

            // Why doesn't profession gear have the above flag? WHO KNOWS
            if (
                item.inventoryType === InventoryType.ProfessionGear ||
                item.inventoryType === InventoryType.ProfessionTool
            ) {
                return false;
            }

            // These are weird fake weapons
            if (
                item.classId === ItemClass.Weapon &&
                (item.subclassId === WeaponSubclass.Miscellaneous ||
                    item.subclassId === WeaponSubclass.Thrown)
            ) {
                return false;
            }

            // Gold check
            if (maxGold > 0 && thing.auctions[0].buyoutPrice > maxGold) {
                return false;
            }

            const meetsDontHave = auctionState.showDontHave || thing.hasItems.length > 0;
            const meetsHave = auctionState.showHave || thing.hasItems.length === 0;

            const meetsMinQuality = item.quality >= auctionState.missingTransmogMinQuality;

            const matchesExpansion =
                auctionState.missingTransmogExpansion === -1 ||
                item.expansion === auctionState.missingTransmogExpansion;

            const matchesName = item.name.toLocaleLowerCase().indexOf(nameLower) >= 0;
            const matchesRealm = thing.auctions
                .slice(0, auctionState.limitToCheapestRealm ? 1 : undefined)
                .some(
                    (auction) =>
                        staticData.connectedRealms[auction.connectedRealmId].realmNames.filter(
                            (name) => name.toLocaleLowerCase().indexOf(realmLower) >= 0,
                        ).length > 0,
                );

            let matchesArmor = true;
            if (auctionState.missingTransmogItemClass === 'armor') {
                if (item.classId !== ItemClass.Armor) {
                    matchesArmor = false;
                } else if (auctionState.missingTransmogItemSubclassArmor >= 0) {
                    if (auctionState.missingTransmogItemSubclassArmor === 100) {
                        matchesArmor =
                            item.subclassId === 0 && item.inventoryType == InventoryType.Shirt;
                    } else {
                        matchesArmor =
                            item.subclassId === auctionState.missingTransmogItemSubclassArmor;
                    }
                }
            }

            let matchesWeapon = true;
            if (auctionState.missingTransmogItemClass === 'weapon') {
                if (item.classId !== ItemClass.Weapon) {
                    matchesWeapon = false;
                } else if (
                    auctionState.missingTransmogItemSubclassWeapon >= 0 &&
                    item.subclassId !== auctionState.missingTransmogItemSubclassWeapon
                ) {
                    matchesWeapon = false;
                }
            }

            let matchesSource = true;
            if (!auctionState.missingTransmogShowCrafted) {
                matchesSource =
                    staticData.itemToSkillLineAbility[item.id] === undefined &&
                    !extraCraftedItemIds.has(item.id);
            }

            return (
                meetsDontHave &&
                meetsHave &&
                meetsMinQuality &&
                matchesExpansion &&
                matchesName &&
                matchesRealm &&
                matchesArmor &&
                matchesWeapon &&
                matchesSource
            );
        });

        return [things, updated];
    }
}
export const userAuctionMissingTransmogStore = new UserAuctionMissingTransmogDataStore();
