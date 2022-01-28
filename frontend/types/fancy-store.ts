import { get, writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

import { Language } from '@/types/enums'
import fetchJson from '@/utils/fetch-json'


export interface FancyStore<TData> {
    data?: TData
    error: boolean
    loaded: boolean
}

export interface WritableFancyStore<TData> extends Writable<FancyStore<TData>> {
    fetch(ifNotLoaded?: boolean, language?: Language): Promise<boolean>
    get(): FancyStore<TData>
    initialize?(data: TData): void
    readonly dataUrl: string
}

export class WritableFancyStore<TData> {
    private value: FancyStore<TData>

    constructor(data: TData = null) {
        this.value = {
            data,
            error: false,
            loaded: false
        }
        const original = writable<FancyStore<TData>>(this.value)

        this.set = (newValue: FancyStore<TData>) => {
            original.set(this.value = newValue)
        }
        this.subscribe = original.subscribe
        this.update = (stateFunc: (originalValue: FancyStore<TData>) => FancyStore<TData>) => {
            original.update((oldValue: FancyStore<TData>) => (this.value = stateFunc(oldValue)))
        }
    }

    get(): FancyStore<TData> {
        return this.value
    }

    async fetch(ifNotLoaded = true, language = Language.enUS): Promise<boolean> {
        if (ifNotLoaded && get(this).loaded) {
            return false
        }

        const url = this.dataUrl.replace('zzZZ', Language[language])
        if (!url) {
            this.update(state => {
                state.error = true
                return state
            })
            return true
        }

        const baseUri = document.getElementById('app')?.getAttribute('data-base-uri')
        const actualUrl = baseUri + url.substring(1)

        const json = await fetchJson(actualUrl)
        if (json === null) {
            this.update(state => {
                state.error = true
                return state
            })
            return true
        }

        const jsonData = JSON.parse(json) as TData
        this.initialize?.(jsonData)

        this.update(state => {
            state.data = jsonData
            state.loaded = true
            return state
        })

        return true
    }
}
