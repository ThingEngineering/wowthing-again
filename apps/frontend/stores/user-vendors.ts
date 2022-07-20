import { UserCount, WritableFancyStore } from '@/types'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import userHasDrop from '@/utils/user-has-drop'
import type { VendorState } from '@/stores/local-storage'
import type { Settings, UserData } from '@/types'
import type { UserTransmogData, UserVendorData } from '@/types/data'
import type { ManualData, ManualDataVendorItem } from '@/types/data/manual'
import { RewardType } from '@/types/enums'


export class UserVendorStore extends WritableFancyStore<UserVendorData> {
    setup(
        settingsData: Settings,
        manualData: ManualData,
        userData: UserData,
        userTransmogData: UserTransmogData,
        vendorState: VendorState
    ): void {
        // console.time('UserVendorStore.setup')

        const classMask = getTransmogClassMask(settingsData)

        const seen: Record<string, boolean> = {}
        const stats: Record<string, UserCount> = {}
        const userHas: Record<string, boolean> = {}

        const overallStats = stats['OVERALL'] = new UserCount()

        for (const categories of manualData.vendors.sets) {
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

                    const appearanceMap: Record<number, ManualDataVendorItem> = {}

                    group.sellsFiltered = []
                    for (const thing of group.sells) {
                        if (thing.classMask > 0 && (thing.classMask & classMask) === 0) {
                            continue
                        }

                        if (transmogTypes.indexOf(thing.type) >= 0) {
                            const appearanceId = thing.appearanceId || manualData.shared.items[thing.id].appearanceId
                            if (appearanceId) {
                                if (appearanceMap[appearanceId]) {
                                    appearanceMap[appearanceId].extraAppearances++
                                    continue
                                }
                                else {
                                    appearanceMap[appearanceId] = thing
                                    thing.extraAppearances = 0
                                }
                            }
                        }

                        const hasDrop = userHasDrop(
                            manualData,
                            userData,
                            userTransmogData,
                            thing.type,
                            thing.id,
                            thing.appearanceId
                        )
                        const thingKey = `${thing.type}-${thing.id}`

                        if (!seen[thingKey]) {
                            overallStats.total++
                        }
                        baseStats.total++
                        catStats.total++
                        groupStats.total++

                        if (hasDrop) {
                            if (!seen[thingKey]) {
                                overallStats.have++
                            }
                            baseStats.have++
                            catStats.have++
                            groupStats.have++

                            userHas[thingKey] = true
                        }

                        seen[thingKey] = true

                        if (hasDrop && !vendorState.showCollected) {
                            continue
                        }
                        if (!hasDrop && !vendorState.showUncollected) {
                            continue
                        }

                        group.sellsFiltered.push(thing)
                    }
                }
            }
        }

        this.update((state) => {
            state.data.stats = stats
            state.data.userHas = userHas
            return state
        })

        // console.timeEnd('UserVendorStore.setup')
    }
}

export const userVendorStore = new UserVendorStore({})

const transmogTypes: RewardType[] = [
    RewardType.Armor,
    RewardType.Cosmetic,
    RewardType.Transmog,
    RewardType.Weapon,
]
