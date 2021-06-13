import { writable } from 'svelte/store'

import type { Settings } from '@/types'

export const data = writable<Settings>(
    JSON.parse(document.getElementById('app').getAttribute('data-settings')),
)

export default {
    data,
}
