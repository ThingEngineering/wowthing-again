import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

import { Language } from '@/enums/language'
import fetchJson from '@/utils/fetch-json'


export interface FancyStoreFetchOptions {
    evenIfLoaded: boolean
    onlyIfLoaded: boolean
    language: Language
}

export type FancyStoreType<T> = T & {
    error: boolean
    loaded: boolean
}

export interface WritableFancyStore<T> extends Writable<FancyStoreType<T>> {
    fetch(options: Partial<FancyStoreFetchOptions>): Promise<boolean>
    get(): FancyStoreType<T>
    initialize?(data: T): void
    readonly dataUrl: string
}

export class WritableFancyStore<T> {
    protected value: FancyStoreType<T>

    constructor(data: T = null) {
        this.value = {
            ...data,
            error: false,
            loaded: false,
        }
        const original = writable<FancyStoreType<T>>(this.value)

        this.set = (newValue: FancyStoreType<T>) => {
            original.set(this.value = newValue)
        }
        this.subscribe = original.subscribe
        this.update = (stateFunc: (originalValue: FancyStoreType<T>) => FancyStoreType<T>) => {
            original.update((oldValue: FancyStoreType<T>) => (this.value = stateFunc(oldValue)))
        }
    }

    get(): FancyStoreType<T> {
        return this.value
    }

    async fetch(options?: Partial<FancyStoreFetchOptions>): Promise<boolean> {
        const wasLoaded = this.value.loaded
        if (options?.evenIfLoaded !== true && wasLoaded) {
            //789'evenIfLoaded', options)
            return false
        }
        if (options?.onlyIfLoaded === true && !wasLoaded) {
            //console.log('onlyIfLoaded', options)
            return false
        }

        const url = this.dataUrl.replace('zzZZ', Language[options?.language ?? Language.enUS])
        if (!url) {
            this.update(state => {
                state.error = true
                return state
            })
            return true
        }

        const baseUri = document.getElementById('app')?.getAttribute('data-base-uri')
        const actualUrl = baseUri + url.substring(1)

        let data: T
        let redirected: boolean
        try {
            [data, redirected] = await fetchJson<T>(actualUrl)
        }
        catch (err) {
            console.error(err)
            // Only set the error state if we weren't previously loaded to avoid breaking
            // everything on an attempted refresh
            if (!wasLoaded) {
                this.update(state => {
                    state.error = true
                    return state
                })
            }
            return false
        }

        // Redirected SHOULD mean it was a 304
        if (wasLoaded && redirected) {
            //console.log('wasLoaded', options)
            return true
        }

        if (data === null) {
            this.update(state => {
                state.error = true
                return state
            })
            return false
        }

        this.initialize?.(data)

        this.update(state => {
            state = {
                ...data,
                error: false,
                loaded: true,
            }
            return state
        })

        return true
    }
}
