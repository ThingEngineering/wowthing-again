import flattenDeep from 'lodash/flattenDeep'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import without from 'lodash/without'

import { journalDifficultyMap, raidDifficulties } from '@/data/difficulty'
import { worldBossInstanceIds } from '@/data/dungeon'
import { UserCount, WritableFancyStore, type UserData } from '@/types'
import { JournalDataEncounter, JournalDataEncounterItem, type JournalDataTier } from '@/types/data'
import { RewardType } from '@/enums'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import getFilteredItems from '@/utils/journal/get-filtered-items'
import leftPad from '@/utils/left-pad'
import type { JournalState } from '@/stores/local-storage'
import type { Settings } from '@/types'
import type { JournalData, UserTransmogData } from '@/types/data'
import type { ManualData } from '@/types/data/manual'
import type { StaticData } from '@/types/data/static'


export class JournalDataStore extends WritableFancyStore<JournalData> {
    get dataUrl(): string {
        return document
            .getElementById('app')
            ?.getAttribute('data-journal')
    }

    initialize(data: JournalData): void {
        console.time('JournalDataStore.initialize')

        const extraTiers: JournalDataTier[] = [
            {
                id: 1000001,
                name: 'Dungeons',
                slug: 'dungeons',
                instances: [],
                subTiers: [],
            },
            {
                id: 1000002,
                name: 'Raids',
                slug: 'raids',
                instances: [],
                subTiers: [],
            },
            {
                id: 1000099,
                name: 'World Bosses',
                slug: 'world-bosses',
                instances: [],
            },
        ]

        for (const tier of data.tiers.filter((tier) => tier !== null)) {
            for (const extraTier of extraTiers) {
                if (extraTier.id !== 1000099) {
                    extraTier.subTiers.push({
                        id: 1000000 + tier.id,
                        name: tier.name,
                        slug: tier.slug,
                        instances: [],
                    })
                }
            }

            for (const instance of tier.instances.filter(instance => instance !== null)) {
                if (instance.encountersRaw !== null) {
                    instance.encounters = instance.encountersRaw
                        .map((encounterArray) => new JournalDataEncounter(...encounterArray))
                    instance.encountersRaw = null

                    const difficulties = uniq(flattenDeep(instance.encounters.map(
                        (encounter) => encounter.groups.map(
                            (group) => group.items.map(
                                (item) => item.appearances.map(
                                    (appearance) => appearance.difficulties
                                )
                            )
                        )
                    )))

                    const withoutRaid = without(difficulties, ...raidDifficulties)

                    if (worldBossInstanceIds.indexOf(instance.id) >= 0) {
                        const wbInstance = {
                            ...instance,
                            name: tier.name,
                            slug: tier.slug,
                        }
                        extraTiers[2].instances.push(wbInstance)
                        instance.isRaid = true
                    }
                    else if (withoutRaid.length === 0) {
                        extraTiers[1].subTiers[extraTiers[1].subTiers.length - 1].instances.push(instance)
                        instance.isRaid = true
                    }
                    else {
                        // Possibly not all dungeons but close enough
                        extraTiers[0].subTiers[extraTiers[0].subTiers.length - 1].instances.push(instance)
                        instance.isRaid = false
                    }
                }
            }
        }

        data.tiers.push(null)
        data.tiers.push(...extraTiers)

        console.timeEnd('JournalDataStore.initialize')
    }

    setup(
        settingsData: Settings,
        journalData: JournalData,
        journalState: JournalState,
        manualData: ManualData,
        staticData: StaticData,
        userData: UserData,
        userTransmogData: UserTransmogData
    ): void {
        console.time('JournalDataStore.setup')

        const classMask = getTransmogClassMask(settingsData)
        const masochist = settingsData.transmog.completionistMode
        const stats: Record<string, UserCount> = {}

        const overallStats = stats['OVERALL'] = new UserCount()
        const overallDungeonStats = stats['dungeons'] = new UserCount()
        const overallRaidStats = stats['raids'] = new UserCount()
        const overallSeen: Record<string, boolean> = {}

        for (const tier of journalData.tiers.filter((tier) => tier !== null && tier.slug !== 'dungeons' && tier.slug !== 'raids')) {
            const tierStats = stats[tier.slug] = new UserCount()
            const tierSeen: Record<string, boolean> = {}

            const tierDungeonStats = stats[`dungeons--${tier.slug}`] = new UserCount()
            const tierRaidStats = stats[`raids--${tier.slug}`] = new UserCount()

            for (const instance of tier.instances.filter(instance => instance !== null)) {
                const overallStats2 = instance.isRaid ? overallRaidStats : overallDungeonStats
                const tierStats2 = instance.isRaid ? tierRaidStats : tierDungeonStats

                const instanceKey = `${tier.slug}--${instance.slug}`
                const instanceStats = stats[instanceKey] = new UserCount()
                const instanceSeen: Record<string, boolean> = {}

                const instanceExpansion = staticData.instances[instance.id]?.expansion ?? 0

                for (const encounter of instance.encounters) {
                    if (encounter.id === 857) {
                        encounter.name = staticData.reputations[1341].name
                    }

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
                                        userTransmogData.sourceHas[appearanceKey] :
                                        userTransmogData.userHas[appearance.appearanceId]
                                }
                                else {
                                    appearanceKey = `z-${item.type}-${item.id}`

                                    if (item.type === RewardType.Illusion) {
                                        const enchantmentId = staticData.illusions[item.appearances[0].appearanceId].enchantmentId
                                        userHas = !!userTransmogData.hasIllusion[enchantmentId]
                                    }
                                    else if (item.type === RewardType.Mount) {
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
                                    const instanceDifficultyStats = stats[instanceDifficultyKey] ||= new UserCount()

                                    const encounterDifficultyKey = `${encounterKey}--${difficulty}`
                                    const encounterDifficultyStats = stats[encounterDifficultyKey] ||= new UserCount()

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
            state.stats = stats
            return state
        })

        console.timeEnd('JournalDataStore.setup')
    }
}

export const journalStore = new JournalDataStore()
