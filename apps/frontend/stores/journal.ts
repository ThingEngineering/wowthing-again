import findIndex from 'lodash/findIndex'
import sortBy from 'lodash/sortBy'

import { journalDifficultyMap, journalDifficultyOrder } from '@/data/difficulty'
import { UserCount, WritableFancyStore, type UserData } from '@/types'
import { JournalDataEncounter, JournalDataEncounterItem } from '@/types/data'
import { RewardType } from '@/types/enums'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import getFilteredItems from '@/utils/journal/get-filtered-items'
import leftPad from '@/utils/left-pad'
import type { JournalState } from '@/stores/local-storage'
import type { Settings } from '@/types'
import type { JournalData, UserTransmogData } from '@/types/data'
import type { StaticData } from '@/types/data/static'


export class JournalDataStore extends WritableFancyStore<JournalData> {
    get dataUrl(): string {
        return document
            .getElementById('app')
            ?.getAttribute('data-journal')
    }

    initialize(data: JournalData): void {
        // console.time('JournalDataStore.initialize')

        for (const tier of data.tiers.filter((tier) => tier !== null)) {
            for (const instance of tier.instances) {
                if (instance.encountersRaw !== null) {
                    instance.encounters = instance.encountersRaw
                        .map((encounterArray) => new JournalDataEncounter(...encounterArray))
                    instance.encountersRaw = null
                }
            }
        }

        // console.timeEnd('JournalDataStore.initialize')
    }

    setup(
        settingsData: Settings,
        journalData: JournalData,
        journalState: JournalState,
        staticData: StaticData,
        userData: UserData,
        userTransmogData: UserTransmogData
    ): void {
        // console.time('JournalDataStore.setup')

        const classMask = getTransmogClassMask(settingsData)
        const masochist = settingsData.transmog.completionistMode
        const stats: Record<string, UserCount> = {}

        const overallStats = stats['OVERALL'] = new UserCount()
        const overallSeen: Record<string, boolean> = {}

        for (const tier of journalData.tiers.filter((tier) => tier !== null)) {
            const tierStats = stats[tier.slug] = new UserCount()
            const tierSeen: Record<string, boolean> = {}

            for (const instance of tier.instances) {
                const instanceKey = `${tier.slug}--${instance.slug}`
                const instanceStats = stats[instanceKey] = new UserCount()
                const instanceSeen: Record<string, boolean> = {}

                const instanceExpansion = staticData.instances[instance.id]?.expansion ?? 0

                for (const encounter of instance.encounters) {
                    const encounterKey = `${instanceKey}--${encounter.name}`
                    const encounterStats = stats[encounterKey] = new UserCount()
                    const encounterSeen: Record<string, boolean> = {}

                    if (!journalState.showTrash && encounter.name === 'Trash Drops') {
                        continue
                    }

                    for (const group of encounter.groups) {
                        const groupKey = `${encounterKey}--${group.name}`
                        const groupStats = stats[groupKey] = new UserCount()
                        const groupSeen: Record<string, boolean> = {}

                        let filteredItems = getFilteredItems(
                            journalState,
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

                            filteredItems = sortBy(
                                keepItems,
                                (item) => [
                                    leftPad(
                                        findIndex(group.items, (origItem) => origItem.id === item.id),
                                        3,
                                        '0'
                                    ),
                                    journalDifficultyOrder.indexOf(item.appearances[0].difficulties[0])
                                ].join('|')
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
                                        userTransmogData.sourceHas[appearanceKey] :
                                        userTransmogData.userHas[appearance.appearanceId]
                                }
                                else {
                                    appearanceKey = `z-${item.type}-${item.id}`

                                    if (item.type === RewardType.Mount) {
                                        userHas = userData.hasMount[item.classId]
                                    }
                                    else if (item.type === RewardType.Pet) {
                                        userHas = userData.hasPet[item.classId]
                                    }
                                    else if (item.type === RewardType.Toy) {
                                        userHas = userData.hasToy[item.id]
                                    }
                                }

                                if (!userHas) {
                                    allCollected = false
                                }


                                if (!overallSeen[appearanceKey]) {
                                    overallStats.total++
                                }
                                if (!tierSeen[appearanceKey]) {
                                    tierStats.total++
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
                                    }
                                    if (!tierSeen[appearanceKey]) {
                                        tierStats.have++
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
                                    const instanceDifficultyStats = stats[instanceDifficultyKey] ||= new UserCount()

                                    const encounterDifficultyKey = `${encounterKey}--${difficulty}`
                                    const encounterDifficultyStats = stats[encounterDifficultyKey] ||= new UserCount()

                                    const itemKey = `${appearanceKey}--${difficulty}`

                                    if (!instanceSeen[itemKey]) {
                                        instanceDifficultyStats.total++
                                        if (userHas) {
                                            instanceDifficultyStats.have++
                                        }
                                    }

                                    if (!encounterSeen[itemKey]) {
                                        encounterDifficultyStats.total++
                                        if (userHas) {
                                            encounterDifficultyStats.have++
                                        }
                                    }

                                    instanceSeen[itemKey] = true
                                    encounterSeen[itemKey] = true
                                }
                            }

                            if (
                                (journalState.showUncollected && !allCollected) ||
                                (journalState.showCollected && allCollected)
                            ) {
                                item.show = true
                            }
                        }
                        group.filteredItems = filteredItems
                    }
                }
            }
        }

        this.update((state) => {
            state.data.stats = stats
            return state
        })

        // console.timeEnd('JournalDataStore.setup')
    }
}

export const journalStore = new JournalDataStore()
