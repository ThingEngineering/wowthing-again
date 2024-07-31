import { writable, type Writable } from 'svelte/store'


export const parsedTextStore: Writable<Record<string, string>> = writable({})
