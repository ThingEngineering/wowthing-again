import sumBy from 'lodash/sumBy'
import { get } from 'svelte/store'

import {data as settingsData} from '@/stores/settings'

export default function getCharacterTableSpan(): number {
    const settings = get(settingsData)
    return 2 + sumBy(
        [
            settings.general.showRaceIcon,
            settings.general.showClassIcon,
            settings.general.showSpecIcon,
            settings.general.showRealm,
        ],
        (b) => Number(b),
    )
}
