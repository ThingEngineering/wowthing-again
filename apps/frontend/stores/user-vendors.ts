import { UserCount, WritableFancyStore } from '@/types'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import userHasDrop from '@/utils/user-has-drop'
import type { VendorState } from '@/stores/local-storage'
import type { Settings, UserData } from '@/types'
import type { UserTransmogData, UserVendorData } from '@/types/data'
import type { ManualData, ManualDataVendorItem } from '@/types/data/manual'
import { Faction, RewardType } from '@/types/enums'
import { getCurrencyCosts } from '@/utils/get-currency-costs'
import type { StaticData } from '@/types/data/static'


const pvpRegex = new RegExp(/ - S\d\d/)
const tierRegex = new RegExp(/ - T\d\d/)

export class UserVendorStore extends WritableFancyStore<UserVendorData> {
    setup(
        settingsData: Settings,
        manualData: ManualData,
        staticData: StaticData,
        userData: UserData,
        userTransmogData: UserTransmogData,
        vendorState: VendorState
    ): void {
        // console.time('UserVendorStore.setup')

        const classMask = getTransmogClassMask(settingsData)
        const masochist = settingsData.transmog.completionistMode

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
                    group.sellsFiltered = []

                    if (!vendorState.showPvp && pvpRegex.test(group.name)) {
                        continue
                    }
                    if (!vendorState.showTier && tierRegex.test(group.name)) {
                        continue
                    }

                    const groupKey = `${catKey}--${groupIndex}`
                    const groupStats = stats[groupKey] = new UserCount()

                    const appearanceMap: Record<number, ManualDataVendorItem> = {}

                    for (const item of group.sells) {
                        item.sortedCosts = getCurrencyCosts(manualData, staticData, item.costs)

                        if (item.classMask > 0 && (item.classMask & classMask) === 0) {
                            continue
                        }

                        if (masochist) {
                            item.extraAppearances = 0
                        }
                        else if (transmogTypes.indexOf(item.type) >= 0) {
                            const appearanceId = item.appearanceIds?.length === 1
                                ? item.appearanceIds[0]
                                : manualData.shared.items[item.id].appearanceIds?.[0] || 0
                            if (appearanceId) {
                                const existingItem = appearanceMap[appearanceId]
                                if (existingItem) {
                                    existingItem.extraAppearances++

                                    if (existingItem.faction !== Faction.Both && item.faction !== existingItem.faction) {
                                        existingItem.faction = Faction.Both
                                    }

                                    continue
                                }
                                else {
                                    appearanceMap[appearanceId] = item
                                    item.extraAppearances = 0
                                }
                            }
                        }

                        const hasDrop = userHasDrop(
                            manualData,
                            userData,
                            userTransmogData,
                            item.type,
                            item.id,
                            item.appearanceIds
                        )
                        const thingKey = `${item.type}|${item.id}|${(item.bonusIds || []).join(',')}`

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

                        if (
                            (item.type === RewardType.Illusion && !vendorState.showIllusions) ||
                            (item.type === RewardType.Mount && !vendorState.showMounts) ||
                            (item.type === RewardType.Pet && !vendorState.showPets) ||
                            (item.type === RewardType.Toy && !vendorState.showToys) ||
                            (item.type === RewardType.Armor && item.subType === 1 && !vendorState.showCloth) ||
                            (item.type === RewardType.Armor && item.subType === 2 && !vendorState.showLeather) ||
                            (item.type === RewardType.Armor && item.subType === 3 && !vendorState.showMail) ||
                            (item.type === RewardType.Armor && item.subType === 4 && !vendorState.showPlate) ||
                            (item.type === RewardType.Weapon && !vendorState.showWeapons)
                        ) {
                            continue
                        }

                        group.sellsFiltered.push(item)
                    } // item of group.sells

                    group.stats = groupStats
                } // group of category.groups
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

export const transmogTypes: RewardType[] = [
    RewardType.Armor,
    RewardType.Cosmetic,
    RewardType.Transmog,
    RewardType.Weapon,
]
