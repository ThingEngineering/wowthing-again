import { writable } from 'svelte/store'

import { ItemLocation } from '@/types/enums'
import type { ItemSearchResponseCharacter, ItemSearchResponseItem } from '@/types/items'


export class ItemSearchState {
    public searchTerms = ''
    public location = ItemLocation.Any

    private static minimumTermsLength = 3
    private static url = '/api/item-search'

    async search(): Promise<ItemSearchResponseItem[]> {
        const xsrf = document.getElementById('app')
            .getAttribute('data-xsrf')

        const data = {
            terms: this.searchTerms,
            location: this.location,
        }

        const response = await fetch(ItemSearchState.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': xsrf,
            },
            body: JSON.stringify(data),
        })

        if (response.ok) {
            const result = await response.json() as ItemSearchResponseItem[]

            for (const item of result) {
                const itemMap: Record<string, ItemSearchResponseCharacter[]> = {}
                for (const character of item.characters) {
                    const key = [
                        character.characterId,
                        character.location,
                        character.quality,
                        character.itemLevel,
                        (character.bonusIds || []).join(':'),
                    ].join('|')

                    if (!itemMap[key]) {
                        itemMap[key] = []
                    }
                    itemMap[key].push(character)
                }

                const newCharacters: ItemSearchResponseCharacter[] = []
                for (const key of Object.keys(itemMap)) {
                    const character = itemMap[key][0]
                    character.count = itemMap[key].reduce((a: number, b) => a + b.count, 0)
                    newCharacters.push(character)
                }

                item.characters = newCharacters
            }

            return result
        }
    }

    get isValid(): boolean {
        return this.searchTerms.trim().length >= ItemSearchState.minimumTermsLength
    }
}


export const itemSearchState = writable<ItemSearchState>(new ItemSearchState())
