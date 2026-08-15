import { searchItems } from './search-items.svelte';
import type { SearchItemsResult } from './types';

class SearchState {
    #inProgress: boolean = $state(false);
    #tooManyItems: boolean = $state(false);
    #results: SearchItemsResult['results'] = $state(null);

    get inProgress() {
        return this.#inProgress;
    }

    get tooManyItems() {
        return this.#tooManyItems;
    }

    get results() {
        return this.#results;
    }

    search() {
        this.#inProgress = true;
        this.#tooManyItems = false;

        const { results, tooManyItems } = searchItems();

        this.#tooManyItems = tooManyItems;
        this.#inProgress = false;
        this.#results = results;
    }
}

export const searchState = new SearchState();
