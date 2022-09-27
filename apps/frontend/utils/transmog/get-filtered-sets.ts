import some from 'lodash/some'

import type { Settings } from '@/types'
import type { ManualDataTransmogGroup, ManualDataTransmogGroupData } from '@/types/data/manual'
import type { UserTransmogData } from '@/types/data'


export default function getFilteredSets(
    settings: Settings,
    userTransmogData: UserTransmogData,
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
                (skipUnavailable && setName.endsWith('*') && !hasAnyOfSets(userTransmogData,
                    Object.values(group.data).map((datas) => datas[setIndex])))
            ),
            setName
        ])
    }

    return ret
}

function hasAnyOfSets(
    userTransmogData: UserTransmogData,
    sets: ManualDataTransmogGroupData[]
): boolean {
    return some(
        sets,
        (set) => some(
            set.items || {},
            (itemIds) => some(
                itemIds,
                (itemId) => userTransmogData.userHas[itemId]
            )
        )
    )
}
