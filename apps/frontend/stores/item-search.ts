import sortBy from 'lodash/sortBy';
import { writable } from 'svelte/store';

import { ItemLocation } from '@/enums/item-location';
import { ItemQuality } from '@/enums/item-quality';
import type {
    ItemSearchResponseCharacter,
    ItemSearchResponseGuildBank,
    ItemSearchResponseItem,
} from '@/types/items';
import { userState } from '@/user-home/state/user';

type ItemSearchGroupBy = 'character' | 'item';

export class ItemSearchState {
    public groupBy: ItemSearchGroupBy = 'item';
    public includeEquipped = false;
    public location = ItemLocation.Any;
    public minimumQuality = ItemQuality.Uncommon;
    public searchTerms = '';

    private static minimumTermsLength = 3;
    private static url = '/api/item-search';

    async search(): Promise<ItemSearchResponseItem[]> {
        const xsrf = document.getElementById('app').getAttribute('data-xsrf');

        const data = {
            terms: this.searchTerms,
            location: this.location,
        };

        const response = await fetch(ItemSearchState.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                RequestVerificationToken: xsrf,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = (await response.json()) as ItemSearchResponseItem[];

            for (const item of result) {
                // Combine character items into a single stack
                const characterMap: Record<string, ItemSearchResponseCharacter[]> = {};
                for (const character of item.characters || []) {
                    const key = [
                        character.characterId,
                        character.location,
                        character.quality,
                        character.itemLevel,
                        (character.bonusIds || []).join(':'),
                    ].join('|');

                    characterMap[key] ||= [];
                    characterMap[key].push(character);
                }

                const newCharacters: ItemSearchResponseCharacter[] = [];
                for (const key of Object.keys(characterMap)) {
                    const character = characterMap[key][0];
                    character.count = characterMap[key].reduce((a: number, b) => a + b.count, 0);
                    newCharacters.push(character);
                }

                item.characters = sortBy(newCharacters, (characterResposne) => {
                    const character =
                        userState.general.characterById[characterResposne.characterId];
                    return [character.realm.region, character.realm.name];
                });

                // Combine guild items into a single stack
                const guildBankMap: Record<string, ItemSearchResponseGuildBank[]> = {};
                for (const guildBank of item.guildBanks || []) {
                    const key = [
                        guildBank.guildId,
                        guildBank.tab,
                        guildBank.quality,
                        guildBank.itemLevel,
                        (guildBank.bonusIds || []).join(':'),
                    ].join('|');

                    guildBankMap[key] ||= [];
                    guildBankMap[key].push(guildBank);
                }

                const newGuildBanks: ItemSearchResponseGuildBank[] = [];
                for (const key of Object.keys(guildBankMap)) {
                    const guildBank = guildBankMap[key][0];
                    guildBank.count = guildBankMap[key].reduce((a: number, b) => a + b.count, 0);
                    newGuildBanks.push(guildBank);
                }

                item.guildBanks = sortBy(newGuildBanks, (guildResponse) => {
                    const guild = userState.general.guildById[guildResponse.guildId];
                    return [
                        guild.realm.region,
                        guild.realm.name,
                        guild.name,
                        guildResponse.tab,
                        guildResponse.slot,
                    ];
                });
            }

            return result;
        }
    }

    get isValid(): boolean {
        return this.searchTerms.trim().length >= ItemSearchState.minimumTermsLength;
    }
}

const key = 'state-item-search';
const initialState = new ItemSearchState();
Object.assign(initialState, JSON.parse(localStorage.getItem(key) ?? '{}'));

export const itemSearchState = writable<ItemSearchState>(initialState);

itemSearchState.subscribe((state) => localStorage.setItem(key, JSON.stringify(state)));
