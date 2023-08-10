import every from 'lodash/every'
import flatten from 'lodash/flatten'
import intersection from 'lodash/intersection'
import some from 'lodash/some'
import uniq from 'lodash/uniq'
import { get } from 'svelte/store'

import { itemStore } from './item'
import { manualStore } from './manual'
import { userModifiedStore } from './user-modified'
import { TransmogSetMatchType, TransmogSetType } from '@/enums'
import { UserCount, WritableFancyStore } from '@/types'
import type { FancyStoreType, Settings, UserAchievementData } from '@/types'
import type { UserTransmogData } from '@/types/data'
import type { ItemData } from '@/types/data/item'
import type { ManualData, ManualDataSharedItemSet, ManualDataTransmogSetFiltered } from '@/types/data/manual'


export class UserTransmogDataStore extends WritableFancyStore<UserTransmogData> {
    get dataUrl(): string {
        let url = document.getElementById('app')?.getAttribute('data-user')
        if (url) {
            const modified = get(userModifiedStore).transmog
            url = url.replace(/\/(?:public|private).+$/, `/transmog-${modified}.json`)
        }
        return url
    }

    initialize(data: UserTransmogData): void {
        console.time('UserTransmogDataStore.initialize')

        data.hasAppearance = new Set<number>(data.appearanceIds || [])
        data.hasIllusion = new Set<number>(data.illusionIds || [])
        data.hasSource = new Set<string>(data.appearanceSources || [])

        console.timeEnd('UserTransmogDataStore.initialize')
    }

    setup(
        settings: Settings,
        userAchievementData: UserAchievementData
    ): void {
        console.time('UserTransmogDataStore.setup')

        const itemData = get(itemStore)
        const manualData = get(manualStore)
        const userTransmogData = this.value

        // HACK: Warglaives of Azzinoth
        if (userAchievementData.achievements[426]) {
            userTransmogData.hasSource.add('32837_0')
            userTransmogData.hasSource.add('32838_0')
        }

        this.update((state) => {
            this.setupTransmogSetsV2(
                state,
                settings,
                itemData,
                manualData,
                userTransmogData,
            )

            return state
        })

        console.timeEnd('UserTransmogDataStore.setup')
    }

    private setupTransmogSetsV2(
        state: FancyStoreType<UserTransmogData>,
        settings: Settings,
        itemData: ItemData,
        manualData: ManualData,
        userTransmogData: UserTransmogData,
    ) {
        const completionist = settings.transmog.completionistMode
        const skipAlliance = !settings.transmog.showAllianceOnly
        const skipHorde = !settings.transmog.showHordeOnly
        const skipUnavailable = settings.collections.hideUnavailable
        //const skipClasses = getSkipClasses(settings)

        //const seen: Record<number, boolean> = {}
        const stats: Record<string, UserCount> = {}

        const overallStats = stats['OVERALL'] = new UserCount()

        for (const categories of manualData.transmog.setsV2) {
            if (categories === null) {
                continue
            }

            const baseStats = stats[categories[0].slug] = new UserCount()

            for (const category of categories.slice(1)) {
                const catKey = `${categories[0].slug}--${category.slug}`
                const catStats = stats[catKey] = new UserCount()

                category.filteredGroups = []

                // Pre-filter data
                for (const group of category.groups) {
                    group.filteredSets = []
                    
                    if (
                        (completionist && group.completionist === false) ||
                        (!completionist && group.completionist === true) ||
                        (skipAlliance && group.name.startsWith(':alliance:')) ||
                        (skipHorde && group.name.startsWith(':horde:')) ||
                        (skipUnavailable && group.name.endsWith('*'))
                    ) {
                        continue
                    }

                    category.filteredGroups.push(group)

                    for (const set of group.sets) {
                        if (
                            (completionist && set.completionist === false) ||
                            (!completionist && set.completionist === true) ||
                            (skipAlliance && set.name.startsWith(':alliance:')) ||
                            (skipHorde && set.name.startsWith(':horde:')) ||
                            (skipUnavailable && set.name.endsWith('*'))
                        ) {
                            continue
                        }
    
                        group.filteredSets.push(set)
                    }
                    }

                // Boop
                for (let groupIndex = 0; groupIndex < category.filteredGroups.length; groupIndex++) {
                    const group = category.filteredGroups[groupIndex]
                    const groupKey = `${catKey}--${groupIndex}`
                    const groupStats = stats[groupKey] ||= new UserCount()

                    group.setData = []

                    let itemSets: ManualDataSharedItemSet[]
                    if (group.matchType === TransmogSetMatchType.Any) {
                        itemSets = uniq(
                            flatten(
                                group.matchTags.map((tag) => manualData.shared.itemSetsByTag[tag])
                            )
                        )
                    }
                    else if (group.matchType === TransmogSetMatchType.All) {
                        itemSets = intersection(
                            ...group.matchTags.map((tag) => manualData.shared.itemSetsByTag[tag])
                        )
                    }

                    // let itemSets: ManualDataSharedItemSet[] = []
                    // for (const tag of group.matchTags) {
                    //     const setsByTag = manualData.shared.itemSetsByTag[tag]
                    //     if (setsByTag) {
                    //         itemSets.push(...setsByTag)
                    //     }
                    //     else {
                    //         console.log('Invalid tag?', group, tag)
                    //     }
                    // }
                    // itemSets = uniq(itemSets)

                    // Work out sources for each set
                    for (let setIndex = 0; setIndex < group.filteredSets.length; setIndex++) {
                        const set = group.filteredSets[setIndex]
                        const setKey = `${groupKey}--${setIndex}`
                        const setStats = stats[setKey] ||= new UserCount()
                        
                        const modifier = set.modifier ?? 0
                        const setSets = itemSets.filter((itemSet) => every(
                            set.matchTags,
                            (tag) => itemSet.tags.indexOf(tag) >= 0
                        ))
                        //console.log(set, setSets)

                        const setData: Record<string, Record<number, ManualDataTransmogSetFiltered>> = {}
                        
                        for (const setSet of setSets) {
                            let key: string
                            if (group.type === TransmogSetType.Armor) {
                                key = setSet.tags
                                    .map((tagId) => manualData.tagsById[tagId])
                                    .filter((tagName) => tagName.startsWith('armor:'))[0]
                                    .split(':')[1]
                            }
                            else if (group.type === TransmogSetType.Class) {
                                key = setSet.tags
                                    .map((tagId) => manualData.tagsById[tagId])
                                    .filter((tagName) => tagName.startsWith('class:'))[0]
                                    .split(':')[1]
                            }

                            const setSetData = setData[key] ||= {}

                            for (const itemIds of setSet.items) {
                                for (const itemId of itemIds) {
                                    const item = itemData.items[itemId]
                                    const slotData = setSetData[item.inventoryType] ||= {
                                        sourceIds: [],
                                    }

                                    if (completionist) {
                                        const source = `${itemId}_${modifier}`
                                        slotData.sourceIds.push(source)
                                    }
                                    else {
                                        if (!item.appearances[modifier]) {
                                            // console.log('Missing appearance?', modifier, item)
                                            continue
                                        }

                                        const appearanceId = item.appearances[modifier].appearanceId
                                        const otherItems = itemData.appearanceToItems[appearanceId]
                                        for (const otherItemId of otherItems) {
                                            const otherItem = itemData.items[otherItemId]
                                            const validClassMask = (
                                                otherItem.classMask === 0 ||
                                                (item.classMask & otherItem.classMask) === item.classMask
                                            )
                                            const validRaceMask = true || (
                                                otherItem.raceMask === 0 ||
                                                (item.raceMask & otherItem.raceMask) === item.raceMask
                                            )

                                            //console.log(validClassMask, validRaceMask, item, otherItem)

                                            if (validClassMask && validRaceMask) {
                                                const otherAppearances = Object.entries(otherItem.appearances)
                                                    .filter(([, otherAppearance]) => otherAppearance.appearanceId === appearanceId)
                                                slotData.sourceIds.push(`${otherItemId}_${otherAppearances[0][0]}`)
                                            }
                                        }
                                        //console.log(appearanceId, otherItems)
                                    }
                                }
                            }
                        }

                        for (const [setType, setSetData] of Object.entries(setData)) {
                            const typeKey = `${setKey}--${setType}`
                            const typeStats = stats[typeKey] ||= new UserCount()

                            for (const slotData of Object.values(setSetData)) {
                                slotData.sourceIds = uniq(slotData.sourceIds)
                                
                                overallStats.total++
                                baseStats.total++
                                catStats.total++
                                groupStats.total++
                                setStats.total++
                                typeStats.total++

                                const userHas = (completionist ? every : some)(
                                    slotData.sourceIds,
                                    (sourceId) => userTransmogData.hasSource.has(sourceId)
                                )
                                if (userHas) {
                                    overallStats.have++
                                    baseStats.have++
                                    catStats.have++
                                    groupStats.have++
                                    setStats.have++
                                    typeStats.have++
                                }
                            }

                        }

                        // console.log(setData)

                        group.setData.push(setData)
                    }

                    // console.log(group)
                    // console.log('---')

                    /*for (const [dataKey, dataValue] of Object.entries(group.data)) {
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
                                    if (userTransmogData.userHas[transmogId]) {
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
                    }*/
                }
                // console.log(category)
            }
        }

        // console.log(stats)

        state.statsV2 = stats
    }
}

export const userTransmogStore = new UserTransmogDataStore()
