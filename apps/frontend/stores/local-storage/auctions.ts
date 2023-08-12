import { writable } from 'svelte/store'


export type AuctionStatePerPage = 25 | 50 | 100
export type AuctionStateSortBy =
    | 'name_down'
    | 'name_up'
    | 'price_down'
    | 'price_up'

export class AuctionState {
    public perPage: AuctionStatePerPage = 50

    public allRealms = false
    public extraPetsIgnoreJournal = false
    public hideIgnored = false
    public limitToBestRealms = false
    public limitToCheapestRealm = false
    public limitToHave = false
    public missingPetsMaxLevel = false

    public missingRecipeCharacterId = 0
    public missingRecipeExpansion = -1
    public missingRecipeProfessionId = 0
    public missingRecipeNameSearch = ''
    public missingRecipeRealmSearch = ''
    public missingRecipeSearchType: 'account' | 'character' = 'character'

    public missingTransmogExpansion = -1
    public missingTransmogItemClass = 'any'
    public missingTransmogItemSubclassArmor = -1
    public missingTransmogItemSubclassWeapon = -1
    public missingTransmogMinQuality = 0
    public missingTransmogNameSearch = ''
    public missingTransmogRealmSearch = ''

    public region = '0'

    public ignored: Record<string, Record<number, boolean>> = {}

    public sortBy: Record<string, AuctionStateSortBy> = {
        'extra-pets': 'price_down',
        'missing-mounts': 'name_up',
        'missing-pets': 'name_up',
        'missing-toys': 'name_up',
        'missing-appearance-ids': 'price_up',
        'missing-appearance-sources': 'price_up',
        'missing-recipes': 'price_up',
    }
}

const key = 'state-auctions'
const initialState = new AuctionState()

const stored = JSON.parse(localStorage.getItem(key) ?? '{}') as AuctionState

for (const [sortKey, sortValue] of Object.entries(initialState.sortBy)) {
    if (!!stored && !!stored.sortBy && stored.sortBy[sortKey] === undefined) {
        stored.sortBy[sortKey] = sortValue
    }
}

Object.assign(initialState, stored || {})

export const auctionState = writable<AuctionState>(initialState)

auctionState.subscribe(state => {
    localStorage.setItem(key, JSON.stringify(state))
})
