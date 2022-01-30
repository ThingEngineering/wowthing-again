import { UserCount, WritableFancyStore } from '@/types'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import userHasDrop from '@/utils/user-has-drop'
import type { Settings } from '@/types'
import type { UserVendorData } from '@/types/data'
import type { StaticData } from '@/types/data/static'


export class UserVendorStore extends WritableFancyStore<UserVendorData> {
    setup(
        settingsData: Settings,
        staticData: StaticData
    ): void {
        const classMask = getTransmogClassMask(settingsData)

        const seen: Record<string, boolean> = {}
        const stats: Record<string, UserCount> = {}
        const userHas: Record<string, boolean> = {}

        const overallStats = stats['OVERALL'] = new UserCount()

        for (const categories of staticData.vendorSets) {
            if (categories === null) {
                continue
            }

            const baseStats = stats[categories[0].slug] = new UserCount()

            for (const category of categories.slice(1)) {
                if (category === null) {
                    continue
                }

                const catKey = `${categories[0].slug}--${category.slug}`
                const catStats = stats[catKey] = new UserCount()

                for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                    const group = category.groups[groupIndex]
                    const groupKey = `${catKey}--${groupIndex}`
                    const groupStats = stats[groupKey] = new UserCount()

                    group.filteredThings = []
                    for (const thing of group.things) {
                        if (thing.classMask > 0 && (thing.classMask & classMask) === 0) {
                            continue
                        }
                        group.filteredThings.push(thing)

                        const thingKey = `${group.type}-${thing.id}`

                        if (!seen[thingKey]) {
                            overallStats.total++
                        }
                        baseStats.total++
                        catStats.total++
                        groupStats.total++

                        if (userHasDrop(group.type, thing.appearanceId || thing.id)) {
                            if (!seen[thingKey]) {
                                overallStats.have++
                            }
                            baseStats.have++
                            catStats.have++
                            groupStats.have++

                            userHas[thingKey] = true
                        }

                        seen[thingKey] = true
                    }
                }
            }
        }

        this.update((state) => {
            state.data.stats = stats
            state.data.userHas = userHas
            return state
        })
    }
}

export const userVendorStore = new UserVendorStore({})
