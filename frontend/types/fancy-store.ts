import { get, writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

import fetch_json from '@/utils/fetch-json'


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

    async fetch(ifNotLoaded = true): Promise<void> {
        if (ifNotLoaded && get(this).loaded) {
            return
        }

        const url = this.dataUrl
        if (!url) {
            this.update(state => {
                state.error = true
                return state
            })
            return
        }

        const json = await fetch_json(url)
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
