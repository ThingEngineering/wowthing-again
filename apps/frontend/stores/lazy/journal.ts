import sortBy from 'lodash/sortBy'

import { journalDifficultyMap } from '@/data/difficulty'
import { RewardType } from '@/enums/reward-type'
import { playableClasses } from '@/enums/playable-class'
import { UserCount, type Settings, type UserData } from '@/types'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import getFilteredItems from '@/utils/journal/get-filtered-items'
import { leftPad } from '@/utils/formatting'

import { JournalDataEncounterItem, type JournalData, type UserTransmogData } from '@/types/data'
import type { StaticData } from '@/shared/stores/static/types'
import type { JournalState } from '../local-storage'


export interface LazyJournal {
    filteredItems: Record<string, JournalDataEncounterItem[]>
    stats: Record<string, UserCount>
}

interface LazyStores {
    settings: Settings
    journalState: JournalState
    journalData: JournalData
    staticData: StaticData
    userData: UserData
    userTransmogData: UserTransmogData
}

export function doJournal(stores: LazyStores): LazyJournal {
    console.time('LazyStore.doJournal')

    const ret: LazyJournal = {
        filteredItems: {},
        stats: {},
    }

    const classMask = getTransmogClassMask(stores.settings)
    const masochist = stores.settings.transmog.completionistMode

    const overallStats = ret.stats['OVERALL'] = new UserCount()
    const overallDungeonStats = ret.stats['dungeons'] = new UserCount()
    const overallRaidStats = ret.stats['raids'] = new UserCount()
    const overallSeen: Record<string, boolean> = {}

    for (const tier of stores.journalData.tiers.filter((tier) => tier !== null && tier.slug !== 'dungeons' && tier.slug !== 'raids')) {
        const tierStats = ret.stats[tier.slug] = new UserCount()
        const tierSeen: Record<string, boolean> = {}

        const tierDungeonStats = ret.stats[`dungeons--${tier.slug}`] = new UserCount()
        const tierRaidStats = ret.stats[`raids--${tier.slug}`] = new UserCount()

        for (const instance of tier.instances.filter(instance => instance !== null)) {
            const overallStats2 = instance.isRaid ? overallRaidStats : overallDungeonStats
            const tierStats2 = instance.isRaid ? tierRaidStats : tierDungeonStats

            const instanceKey = `${tier.slug}--${instance.slug}`
            const instanceStats = ret.stats[instanceKey] = new UserCount()
            const instanceSeen: Record<string, boolean> = {}

            const instanceExpansion = stores.staticData.instances[instance.id]?.expansion ?? 0

            for (const encounter of instance.encounters) {
                if (encounter.id === 857) {
                    encounter.name = stores.staticData.reputations[1341].name
                }

                const encounterKey = `${instanceKey}--${encounter.name}`
                const encounterStats = ret.stats[encounterKey] = new UserCount()
                const encounterSeen: Record<string, boolean> = {}

                if (!stores.journalState.showTrash && encounter.name === 'Trash Drops') {
                    continue
                }

                for (const group of encounter.groups) {
                    const groupKey = `${encounterKey}--${group.name}`
                    const groupStats = ret.stats[groupKey] = new UserCount()
                    const groupSeen: Record<string, boolean> = {}

                    let filteredItems = getFilteredItems(
                        stores.journalState,
                        group,
                        classMask,
                        instanceExpansion,
                    )

                    if (!masochist) {
                        const keepItems: JournalDataEncounterItem[] = []

                        const appearanceMap: Record<number, JournalDataEncounterItem[]> = {}
                        for (const item of filteredItems) {
                            if (item.type === RewardType.Item) {
                                for (const appearance of item.appearances) {
                                    (appearanceMap[appearance.appearanceId] ||= []).push(item)
                                }
                            }
                            else {
                                keepItems.push(item)
                            }
                        }

                        const usedItems: Record<number, boolean> = {}
                        for (const [appearanceIdStr, appearanceItems] of Object.entries(appearanceMap)) {
                            const appearanceId = parseInt(appearanceIdStr)

                            const difficulties: Record<number, boolean> = {}
                            let itemId = 0
                            for (const item of appearanceItems) {
                                for (const appearance of item.appearances) {
                                    if (appearance.appearanceId === appearanceId) {
                                        for (const difficulty of appearance.difficulties) {
                                            difficulties[difficulty] = true
                                        }
                                        break
                                    }
                                }

                                if (itemId === 0 && !usedItems[item.id]) {
                                    itemId = item.id
                                    usedItems[item.id] = true
                                }
                            }

                            const item = new JournalDataEncounterItem(
                                appearanceItems[0].type,
                                itemId || appearanceItems[0].id,
                                Math.max(...appearanceItems.map((item) => item.quality)),
                                appearanceItems[0].classId,
                                appearanceItems[0].subclassId,
                                appearanceItems.reduce((a, b) => a | b.classMask, 0),
                                [[
                                    appearanceId,
                                    0,
                                    sortBy(
                                        Object.keys(difficulties)
                                            .map((difficulty) => parseInt(difficulty)),
                                        (diff) => journalDifficultyMap[diff]
                                    )
                                ]]
                            )
                            item.extraAppearances = appearanceItems.length - 1

                            keepItems.push(item)
                        }

                        const groupIndices: Record<number, string> = {}
                        for (let groupItemIndex = 0; groupItemIndex < group.items.length; groupItemIndex++) {
                            const groupItem = group.items[groupItemIndex]
                            if (groupIndices[groupItem.id] === undefined) {
                                groupIndices[groupItem.id] = leftPad(groupItemIndex, 3, '0')
                            }
                        }

                        filteredItems = keepItems.length === 1 ? keepItems : sortBy(
                            keepItems,
                            (item) => `${groupIndices[item.id]}|${journalDifficultyMap[item.appearances[0].difficulties[0]]}`
                        )
                    }

                    for (const item of filteredItems) {
                        let allCollected = true

                        for (const appearance of item.appearances) {
                            let appearanceKey: string
                            let userHas: boolean

                            if (item.type === RewardType.Item) {
                                appearanceKey = masochist ?
                                    `${item.id}_${appearance.modifierId}` :
                                    appearance.appearanceId.toString()
                                
                                userHas = masochist ?
                                    stores.userTransmogData.hasSource.has(appearanceKey) :
                                    stores.userTransmogData.hasAppearance.has(appearance.appearanceId)
                            }
                            else {
                                appearanceKey = `z-${item.type}-${item.id}`

                                if (item.type === RewardType.Illusion) {
                                    const enchantmentId = stores.staticData.illusions[item.appearances[0].appearanceId].enchantmentId
                                    userHas = stores.userTransmogData.hasIllusion.has(enchantmentId)
                                }
                                else if (item.type === RewardType.Mount) {
                                    userHas = stores.userData.hasMount[item.classId]
                                }
                                else if (item.type === RewardType.Pet) {
                                    userHas = stores.userData.hasPet[item.classId]
                                }
                                else if (item.type === RewardType.Toy) {
                                    userHas = stores.userData.hasToy[item.id]
                                }
                            }

                            if (!userHas) {
                                allCollected = false
                            }


                            if (!overallSeen[appearanceKey]) {
                                overallStats.total++
                                overallStats2.total++
                            }
                            if (!tierSeen[appearanceKey]) {
                                tierStats.total++
                                tierStats2.total++
                            }
                            if (!instanceSeen[appearanceKey]) {
                                instanceStats.total++
                            }
                            if (!encounterSeen[appearanceKey]) {
                                encounterStats.total++
                            }
                            if (!groupSeen[appearanceKey]) {
                                groupStats.total++
                            }

                            if (userHas) {
                                if (!overallSeen[appearanceKey]) {
                                    overallStats.have++
                                    overallStats2.have++
                                }
                                if (!tierSeen[appearanceKey]) {
                                    tierStats.have++
                                    tierStats2.have++
                                }
                                if (!instanceSeen[appearanceKey]) {
                                    instanceStats.have++
                                }
                                if (!encounterSeen[appearanceKey]) {
                                    encounterStats.have++
                                }
                                if (!groupSeen[appearanceKey]) {
                                    groupStats.have++
                                }
                            }

                            overallSeen[appearanceKey] = true
                            tierSeen[appearanceKey] = true
                            instanceSeen[appearanceKey] = true
                            encounterSeen[appearanceKey] = true
                            groupSeen[appearanceKey] = true

                            for (const difficulty of appearance.difficulties) {
                                const instanceDifficultyKey = `${instanceKey}--${difficulty}`
                                const instanceDifficultyStats = ret.stats[instanceDifficultyKey] ||= new UserCount()

                                const encounterDifficultyKey = `${encounterKey}--${difficulty}`
                                const encounterDifficultyStats = ret.stats[encounterDifficultyKey] ||= new UserCount()

                                const itemKey = `${appearanceKey}--${difficulty}`

                                if (!instanceSeen[itemKey]) {
                                    instanceDifficultyStats.total++
                                    if (userHas) {
                                        instanceDifficultyStats.have++
                                    }
                                    instanceSeen[itemKey] = true
                                }

                                if (!encounterSeen[itemKey]) {
                                    encounterDifficultyStats.total++
                                    if (userHas) {
                                        encounterDifficultyStats.have++
                                    }
                                    encounterSeen[itemKey] = true
                                }
                            }
                        }

                        if (!allCollected) {
                            for (const [className, classMask] of playableClasses) {
                                if (item.classMask === 0 || (item.classMask & classMask) > 0) {
                                    const classInstanceKey = `${instanceKey}--class:${className}`
                                    const classInstanceStats = ret.stats[classInstanceKey] ||= new UserCount()
                                    classInstanceStats.total++

                                    const classEncounterKey = `${instanceKey}--${encounter.name}--class:${className}`
                                    const classEncounterStats = ret.stats[classEncounterKey] ||= new UserCount()
                                    classEncounterStats.total++
                                }
                            }
                        }

                        if (
                            (stores.journalState.showUncollected && !allCollected) ||
                            (stores.journalState.showCollected && allCollected)
                        ) {
                            item.show = true
                        }
                    } // item of filteredItems

                    ret.filteredItems[groupKey] = filteredItems
                    //group.filteredItems = filteredItems
                }
            }
        }
    }

    console.timeEnd('LazyStore.doJournal')

    return ret
}
