import { derived } from 'svelte/store'
import watchMedia from 'svelte-media'


const queries = {
    small: '(max-width: 1300px)',
    medium: '(min-width: 1301px) and (max-width: 1600px)',
    large: '(min-width: 1601px)',
}

const sizes = {
    small: [900, 600],
    medium: [1200, 800],
    large: [1500, 1000],
}

const mediaStore = watchMedia(queries)

export const zoneMapMedia = derived(
    mediaStore,
    $mediaStore => {
        if ($mediaStore.small) {
            return sizes.small
        }
        else if ($mediaStore.medium) {
            return sizes.medium
        }
        else if ($mediaStore.large) {
            return sizes.large
        }
    }
)
