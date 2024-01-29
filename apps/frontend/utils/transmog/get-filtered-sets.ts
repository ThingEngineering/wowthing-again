import some from 'lodash/some'

import type { Settings } from '@/shared/stores/settings/types'
import type { UserData } from '@/types'
import type { ManualDataTransmogGroup, ManualDataTransmogGroupData } from '@/types/data/manual'


export default function getFilteredSets(
    settings: Settings,
    userData: UserData,
    group: ManualDataTransmogGroup
): [boolean, string][] {
    const ret: [boolean, string][] = []

    const skipAlliance = !settings.transmog.showAllianceOnly
    const skipHorde = !settings.transmog.showHordeOnly
    const skipUnavailable = settings.collections.hideUnavailable

    for (let setIndex = 0; setIndex < group.sets.length; setIndex++) {
        const setName = group.sets[setIndex]
        ret.push([
            !(
                (skipAlliance && setName.indexOf(':alliance:') >= 0) ||
                (skipHorde && setName.indexOf(':horde:') >= 0) ||
                (skipUnavailable && setName.endsWith('*') && !hasAnyOfSets(userData,
                    Object.values(group.data).map((datas) => datas[setIndex])))
            ),
            setName
        ])
    }

    return ret
}

function hasAnyOfSets(
    userData: UserData,
    sets: ManualDataTransmogGroupData[]
): boolean {
    return some(
        sets,
        (set) => some(
            set.items || {},
            (itemIds) => some(
                itemIds,
                (itemId) => userData.hasAppearance.has(itemId)
            )
        )
    )
}
