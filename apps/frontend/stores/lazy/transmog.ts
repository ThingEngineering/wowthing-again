import some from 'lodash/some'

import { UserCount } from '@/types'
import getSkipClasses from '@/utils/get-skip-classes'
import type { Settings } from '@/types'
import type { UserTransmogData } from '@/types/data'
import type { ManualData, ManualDataTransmogCategory } from '@/types/data/manual'
import type { ItemData } from '@/types/data/item'
import type { StaticData } from '@/types/data/static'
import { InventoryType } from '@/enums'


export interface LazyTransmog {
    filteredCategories: ManualDataTransmogCategory[][]
    skip: Set<string>
    slots: Record<string, Record<number, boolean>>
    stats: Record<string, UserCount>
}

interface LazyStores {
    settings: Settings,
    itemData: ItemData,
    manualData: ManualData,
    staticData: StaticData,
    userTransmogData: UserTransmogData,
}

export function doTransmog(stores: LazyStores): LazyTransmog {
    console.time('LazyStore.doTransmog')

    const ret: LazyTransmog = {
        filteredCategories: [],
        skip: new Set<string>(),
        slots: {},
        stats: {},
    }

    const completionistMode = stores.settings.transmog.completionistMode
    const skipAlliance = !stores.settings.transmog.showAllianceOnly
    const skipHorde = !stores.settings.transmog.showHordeOnly
    const skipClasses = getSkipClasses(stores.settings)

    const overallSeen: Record<number, boolean> = {}
    const overallStats = ret.stats['OVERALL'] = new UserCount()

    for (const categories of stores.manualData.transmog.sets) {
        if (categories === null) {
            ret.filteredCategories.push(null)
            continue
        }

        const baseStats = ret.stats[categories[0].slug] = new UserCount()

        const newCategories: ManualDataTransmogCategory[] = []
        for (const category of categories.slice(1)) {
            const catKey = `${categories[0].slug}--${category.slug}`
            const catStats = ret.stats[catKey] = new UserCount()

            let keptAny = false
            for (let groupIndex = 0; groupIndex < category.groups.length; groupIndex++) {
                const group = category.groups[groupIndex]

                for (const [dataKey, dataValue] of Object.entries(group.data)) {
                    if (skipClasses[dataKey]) {
                        continue
                    }

                    const groupKey = `${catKey}--${groupIndex}`
                    const groupStats = ret.stats[groupKey] ||= new UserCount()

                    for (let setIndex = 0; setIndex < dataValue.length; setIndex++) {
                        const setKey = `${groupKey}--${setIndex}`
                        const setName = group.sets[setIndex]

                        // Faction filters
                        if (
                            (skipAlliance && setName.indexOf(':alliance:') >= 0)
                            || (skipHorde && setName.indexOf(':horde') >= 0)
                        ) {
                            ret.skip.add(setKey)
                            continue
                        }

                        keptAny = true

                        // Sets that are explicitly not counted
                        if (setName.endsWith('*')) {
                            continue
                        }
                        
                        const setStats = ret.stats[setKey] ||= new UserCount()

                        const groupSigh = dataValue[setIndex]
                        const slotData: Record<number, boolean> = ret.slots[`${setKey}--${dataKey}`] = {}
                        if (groupSigh.transmogSetId) {
                            const transmogSet = stores.staticData.transmogSets[groupSigh.transmogSetId]
                            for (const [itemId, maybeModifier] of transmogSet.items) {
                                const modifier = maybeModifier || 0
                                const item = stores.itemData.items[itemId]
                                const actualSlot = item.inventoryType === InventoryType.Chest2 ? InventoryType.Chest : item.inventoryType
                                if (
                                    slotData[actualSlot] === true
                                    || (completionistMode && slotData[actualSlot] !== undefined)
                                ) {
                                    continue
                                }
                                slotData[actualSlot] = false
                
                                let userHas = false
                                if (completionistMode || transmogSet.allianceOnly || transmogSet.hordeOnly) {
                                    userHas = stores.userTransmogData.hasSource.has(`${itemId}_${modifier}`)
                                }
                                else {
                                    const appearance = item.appearances[modifier]
                                    userHas = stores.userTransmogData.hasAppearance.has(appearance.appearanceId)
                                }
                                
                                if (userHas) {
                                    slotData[actualSlot] = true
                                }
                            }

                            const setTotal = Object.values(slotData).length
                            const setHave = Object.values(slotData).filter((has) => has === true).length

                            overallStats.total += setTotal
                            baseStats.total += setTotal
                            catStats.total += setTotal
                            groupStats.total += setTotal
                            setStats.total += setTotal

                            overallStats.have += setHave
                            baseStats.have += setHave
                            catStats.have += setHave
                            groupStats.have += setHave
                            setStats.have += setHave
                        }
                        else {
                            const slotKeys = Object.keys(groupSigh.items)
                                .map((key) => parseInt(key))

                            for (const slotKey of slotKeys) {
                                const transmogIds = groupSigh.items[slotKey]
                                const seenAny = some(transmogIds, (id) => overallSeen[id])

                                if (!seenAny) {
                                    overallStats.total++
                                }
                                baseStats.total++
                                catStats.total++
                                groupStats.total++
                                setStats.total++

                                let haveAny = false
                                for (const transmogId of transmogIds) {
                                    if (stores.userTransmogData.hasAppearance.has(transmogId)) {
                                        haveAny = true

                                        if (!overallSeen[transmogId]) {
                                            overallStats.have++
                                        }
                                        baseStats.have++
                                        catStats.have++
                                        groupStats.have++
                                        setStats.have++

                                        break
                                    }
                                }

                                slotData[slotKey] = haveAny

                                for (const transmogId of transmogIds) {
                                    overallSeen[transmogId] = true
                                }
                            }
                        }
                    }
                }
            }

            if (keptAny) {
                newCategories.push(category)
            }
        }

        if (newCategories.length > 0) {
            ret.filteredCategories.push(newCategories)
        }
    }

    console.timeEnd('LazyStore.doTransmog')

    console.log(ret)
    return ret
}
