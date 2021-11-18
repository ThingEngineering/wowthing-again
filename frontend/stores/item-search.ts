import { writable } from 'svelte/store'

import { ItemLocation } from '@/types/enums'
import type { ItemSearchResponseItem } from '@/types/items'


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
            const json = await response.json()
            return json as ItemSearchResponseItem[]
        }
    }

    get isValid(): boolean {
        return this.searchTerms.trim().length >= ItemSearchState.minimumTermsLength
    }
}


export const itemSearchState = writable<ItemSearchState>(new ItemSearchState())
