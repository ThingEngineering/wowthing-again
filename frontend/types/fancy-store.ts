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
    fetch(ifNotLoaded?: boolean): Promise<void>
    initialize?(data: TData): void
    readonly dataUrl: string
}

export class WritableFancyStore<TData> {
    constructor() {
        Object.assign(this, writable<FancyStore<TData>>({
            data: null,
            error: false,
            loaded: false,
        }))
    }

    async fetch(ifNotLoaded = true, language = Language.enUS): Promise<void> {
        if (ifNotLoaded && get(this).loaded) {
            return
        }

        const url = this.dataUrl.replace('zzZZ', Language[language])
        if (!url) {
            this.update(state => {
                state.error = true
                return state
            })
            return
        }

        const baseUri = document.getElementById('app')?.getAttribute('data-base-uri')
        const actualUrl = baseUri + url.substring(1)

        const json = await fetchJson(actualUrl)
        if (json === null) {
            this.update(state => {
                state.error = true
                return state
            })
            return
        }

        const jsonData = JSON.parse(json) as TData
        this.initialize?.(jsonData)

        this.update(state => {
            state.data = jsonData
            state.loaded = true
            return state
        })
    }
}
