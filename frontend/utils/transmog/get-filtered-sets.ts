import type { Settings } from '@/types'
import type { TransmogDataGroup } from '@/types/data'


export default function getFilteredSets(
    settings: Settings,
    group: TransmogDataGroup
): [boolean, string][] {
    const ret: [boolean, string][] = []

    const skipAlliance = !settings.transmog.showAllianceOnly
    const skipHorde = !settings.transmog.showHordeOnly

    for (const setName of group.sets) {
        ret.push([
            !(
                (skipAlliance && setName.indexOf(':alliance:') >= 0) ||
                (skipHorde && setName.indexOf(':horde:') >= 0)
            ),
            setName
        ])
    }

    return ret
}
