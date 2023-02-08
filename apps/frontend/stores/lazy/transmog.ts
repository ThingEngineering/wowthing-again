import some from 'lodash/some'

import { UserCount } from '@/types'
import getSkipClasses from '@/utils/get-skip-classes'
import type { Settings } from '@/types'
import type { UserTransmogData } from '@/types/data'
import type { ManualData } from '@/types/data/manual'


export interface LazyTransmog {
    stats: Record<string, UserCount>
}

interface LazyStores {
    settings: Settings,
    manualData: ManualData,
    userTransmogData: UserTransmogData,
}

export function doTransmog(stores: LazyStores): LazyTransmog {
    console.time('LazyStore.doTransmog')

    const skipAlliance = !stores.settings.transmog.showAllianceOnly
    const skipHorde = !stores.settings.transmog.showHordeOnly
    const skipClasses = getSkipClasses(stores.settings)

    const seen: Record<number, boolean> = {}
    const stats: Record<string, UserCount> = {}

    const overallStats = stats['OVERALL'] = new UserCount()

    for (const categories of stores.manualData.transmog.sets) {
        if (categories === null) {
            continue
        }

        const baseStats = stats[categories[0].slug] = new UserCount()

        for (const category of categories.slice(1)) {
            const catKey = `${categories[0].slug}--${category.slug}`
            const catStats = stats[catKey] = new UserCount()

            for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                const group = category.groups[groupIndex]

                for (const [dataKey, dataValue] of Object.entries(group.data)) {
                    if (skipClasses[dataKey]) {
                        continue
                    }

                    const groupKey = `${catKey}--${groupIndex}`
                    const groupStats = stats[groupKey] = stats[groupKey] || new UserCount()

                    for (let setIndex = 0; setIndex < dataValue.length; setIndex++) {
                        const setName = group.sets[setIndex]

                        // Sets that are explicitly not counted
                        if (setName.endsWith('*')) {
                            continue
                        }
                        // Faction filters
                        if (skipAlliance && setName.indexOf(':alliance:') >= 0) {
                            continue
                        }
                        if (skipHorde && setName.indexOf(':horde') >= 0) {
                            continue
                        }

                        const setKey = `${groupKey}--${setIndex}`
                        const setStats = stats[setKey] = stats[setKey] || new UserCount()

                        const groupSigh = dataValue[setIndex]
                        const slotKeys = Object.keys(groupSigh.items)
                            .map((key) => parseInt(key))

                        for (const slotKey of slotKeys) {
                            const transmogIds = groupSigh.items[slotKey]
                            const seenAny = some(transmogIds, (id) => seen[id])

                            if (!seenAny) {
                                overallStats.total++
                            }
                            baseStats.total++
                            catStats.total++
                            groupStats.total++
                            setStats.total++

                            for (const transmogId of transmogIds) {
                                if (stores.userTransmogData.hasAppearance.has(transmogId)) {
                                    if (!seen[transmogId]) {
                                        overallStats.have++
                                    }
                                    baseStats.have++
                                    catStats.have++
                                    groupStats.have++
                                    setStats.have++
                                    break
                                }
                            }

                            for (const transmogId of transmogIds) {
                                seen[transmogId] = true
                            }
                        }
                    }
                }
            }
        }
    }

    console.timeEnd('LazyStore.doTransmog')

    return {
        stats,
    }
}
