import { skipRecipeItemIds } from '@/data/auctions';
import { professionSpecializationSpells } from '@/data/professions';
import { Faction } from '@/enums/faction';
import { sortAuctions, type SortableAuction } from '@/utils/auctions/sort-auctions';
import {
    type UserAuctionDataMissingRecipeAuctionArray,
    UserAuctionDataMissingRecipeAuction,
} from '@/types/data';
import type { UserData } from '@/types';
import type { ItemData } from '@/types/data/item';
import type { StaticData } from '@/shared/stores/static/types';
import type { AuctionState } from '../local-storage';
import type { UserAuctionEntry } from '../user-auctions';

export class UserAuctionMissingRecipeDataStore {
    private static url = '/api/auctions/missing-recipes';
    private cache: Record<string, [UserAuctionEntry[], Record<number, number>]> = {};

    async search(
        auctionState: AuctionState,
        itemData: ItemData,
        staticData: StaticData,
        userData: UserData,
    ): Promise<[UserAuctionEntry[], Record<number, number>]> {
        let things: UserAuctionEntry[] = [];
        let updated: Record<number, number>;

        const cacheKey = [
            auctionState.region,
            auctionState.allRealms ? '1' : '0',
            auctionState.includeRussia ? '1' : '0',
            auctionState.missingRecipeSearchType,
            auctionState.missingRecipeProfessionId,
            auctionState.missingRecipeSearchType === 'account'
                ? 0
                : auctionState.missingRecipeCharacterId,
        ].join('--');

        if (this.cache[cacheKey]) {
            [things, updated] = this.cache[cacheKey];
        } else {
            const region = parseInt(auctionState.region) || 0;
            const data = {
                allRealms: auctionState.allRealms,
                characterId: 0,
                includeRussia: region === 3 ? auctionState.includeRussia : false,
                professionId: auctionState.missingRecipeProfessionId,
                region: parseInt(auctionState.region) || 0,
            };

            if (auctionState.missingRecipeSearchType === 'character') {
                data.characterId = auctionState.missingRecipeCharacterId;
            }

            const xsrf = document.getElementById('app').getAttribute('data-xsrf');

            const response = await fetch(UserAuctionMissingRecipeDataStore.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    RequestVerificationToken: xsrf,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = (await response.json()) as {
                    auctions: Record<string, UserAuctionDataMissingRecipeAuctionArray[]>;
                    updated: Record<number, number>;
                };
                updated = responseData.updated;

                const parsedData: Record<number, UserAuctionDataMissingRecipeAuction[]> = {};
                for (const [itemIdString, rawAuctions] of Object.entries(responseData.auctions)) {
                    const itemId = parseInt(itemIdString);
                    if (skipRecipeItemIds.has(itemId)) {
                        continue;
                    }

                    parsedData[itemId] = rawAuctions.map(
                        (auctionArray) => new UserAuctionDataMissingRecipeAuction(...auctionArray),
                    );
                }

                for (const [thingId, auctions] of Object.entries(parsedData)) {
                    const id = parseInt(thingId);

                    const item = itemData.items[id];
                    if (!item) {
                        continue;
                    }

                    things.push({
                        id: thingId,
                        name: item.name,
                        auctions,
                        hasItems: userData.itemsById[item.id] || [],
                    });
                }
            }
        }

        things = sortAuctions(
            auctionState.sortBy['missing-recipes'],
            things as SortableAuction[],
            true,
        ) as UserAuctionEntry[];
        this.cache[cacheKey] = [things, updated];

        const nameLower = auctionState.missingRecipeNameSearch.toLocaleLowerCase();
        const realmLower = auctionState.missingRecipeRealmSearch.toLocaleLowerCase();
        things = things.filter((thing) => {
            const item = itemData.items[thing.auctions[0].itemId];

            const meetsDontHave = auctionState.showDontHave || thing.hasItems.length > 0;
            const meetsHave = auctionState.showHave || thing.hasItems.length === 0;

            const [skillLineId] = staticData.itemToSkillLine[item.id];
            const [profession, skillLineExpansion] = staticData.professionBySkillLine[skillLineId];

            const meetsExpansion =
                auctionState.missingRecipeExpansion === -1 ||
                skillLineExpansion === auctionState.missingRecipeExpansion;

            let meetsFaction = true;
            let meetsSpecialization = true;
            if (auctionState.missingRecipeSearchType === 'character') {
                const character = userData.characterMap[auctionState.missingRecipeCharacterId];

                if (item.allianceOnly || item.hordeOnly) {
                    meetsFaction =
                        (item.allianceOnly && character.faction === Faction.Alliance) ||
                        (item.hordeOnly && character.faction === Faction.Horde);
                }

                const requiredAbility = staticData.itemToRequiredAbility[item.id];
                if (professionSpecializationSpells[requiredAbility]) {
                    const charSpecialization = character.professionSpecializations[profession.id];
                    meetsSpecialization =
                        charSpecialization === undefined || charSpecialization === requiredAbility;
                }
            }

            const meetsName = item.name.toLocaleLowerCase().indexOf(nameLower) >= 0;
            const meetsRealm = thing.auctions
                .slice(0, auctionState.limitToCheapestRealm ? 1 : undefined)
                .some(
                    (auction) =>
                        staticData.connectedRealms[auction.connectedRealmId].realmNames.filter(
                            (name) => name.toLocaleLowerCase().indexOf(realmLower) >= 0,
                        ).length > 0,
                );

            return (
                meetsDontHave &&
                meetsHave &&
                meetsExpansion &&
                meetsFaction &&
                meetsSpecialization &&
                meetsName &&
                meetsRealm
            );
        });

        return [things, updated];
    }
}
export const userAuctionMissingRecipeStore = new UserAuctionMissingRecipeDataStore();
