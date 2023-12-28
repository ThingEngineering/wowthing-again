import { derived, type Readable } from 'svelte/store'

import { userStore } from '@/stores'

import { activeView } from './active-view'


export const commonColspan: Readable<number> = derived(
    [
        activeView,
        userStore,
    ],
    ([$activeView,]) => {
        return $activeView.commonFields.length +
            ($activeView.commonFields.indexOf('accountTag') >= 0
                ? (userStore.useAccountTags ? 0 : -1)
                : 0
        )
    }
)
