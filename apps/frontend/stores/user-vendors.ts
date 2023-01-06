import { get } from 'svelte/store'

import { itemStore, manualStore, staticStore } from '@/stores'
import { UserCount, WritableFancyStore } from '@/types'
import { Faction, InventoryType, RewardType } from '@/enums'
import { getCurrencyCosts } from '@/utils/get-currency-costs'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import userHasDrop from '@/utils/user-has-drop'
import type { VendorState } from '@/stores/local-storage'
import type { Settings, UserData } from '@/types'
import type { UserTransmogData, UserVendorData } from '@/types/data'
import type { ManualDataVendorItem } from '@/types/data/manual'


const pvpRegex = new RegExp(/ - S\d\d/)
const tierRegex = new RegExp(/ - T\d\d/)

export class UserVendorStore extends WritableFancyStore<UserVendorData> {
    setup(
        settingsData: Settings,
        userData: UserData,
        userTransmogData: UserTransmogData,
        vendorState: VendorState
    ): void {
        // console.time('UserVendorStore.setup')

        const itemData = get(itemStore)
        const manualData = get(manualStore)
        const staticData = get(staticStore)

        const classMask = getTransmogClassMask(settingsData)
        const masochist = settingsData.transmog.completionistMode

        const seen: Record<string, boolean> = {}
        const stats: Record<string, UserCount> = {}
        const userHas: Record<string, boolean> = {}

        const overallStats = stats['OVERALL'] = new UserCount()

        const unavailableIllusions: number[] = []
        for (const illusionGroup of manualData.illusions) {
            if (illusionGroup.name.startsWith('Unavailable')) {
                for (const illusionItem of illusionGroup.items) {
                    unavailableIllusions.push(illusionItem.enchantmentId)
                }
            }
        }

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
                        item.sortedCosts = getCurrencyCosts(itemData, staticData, item.costs)

                        // Skip items, they're not collectible
                        if (item.type === RewardType.Item) {
                            continue
                        }

                        if (item.classMask > 0 && (item.classMask & classMask) === 0) {
                            continue
                        }

                        const sharedItem = itemData.items[item.id]

                        if (masochist) {
                            item.extraAppearances = 0
                        }
                        else if (transmogTypes.indexOf(item.type) >= 0) {
                            const appearanceId = item.appearanceIds?.length === 1
                                ? item.appearanceIds[0]
                                : sharedItem?.appearances?.[0]?.appearanceId || 0
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
                            itemData,
                            userData,
                            userTransmogData,
                            item.type,
                            item.id,
                            item.appearanceIds
                        )
                        
                        // Skip unavailable illusions
                        if (
                            item.type === RewardType.Illusion &&
                            item.appearanceIds?.length > 0 &&
                            unavailableIllusions.indexOf(item.appearanceIds[0]) >= 0 &&
                            !hasDrop
                        ) {
                            continue
                        }

                        // Skip filtered things
                        if (
                            (item.type === RewardType.Illusion && !vendorState.showIllusions) ||
                            (item.type === RewardType.Mount && !vendorState.showMounts) ||
                            (item.type === RewardType.Pet && !vendorState.showPets) ||
                            (item.type === RewardType.Toy && !vendorState.showToys) ||
                            (item.type === RewardType.Armor &&
                                (item.subType === 1 && !vendorState.showCloth) ||
                                (item.subType === 2 && !vendorState.showLeather) ||
                                (item.subType === 3 && !vendorState.showMail) ||
                                (item.subType === 4 && !vendorState.showPlate)
                            ) ||
                            (item.type === RewardType.Weapon && !vendorState.showWeapons) ||
                            (sharedItem?.inventoryType === InventoryType.Back && !vendorState.showCloaks)
                        ) {
                            continue
                        }

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

                        group.sellsFiltered.push(item)
                    } // item of group.sells

                    group.stats = groupStats
                } // group of category.groups
            }
        }

        this.update((state) => {
            state.stats = stats
            state.userHas = userHas
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
