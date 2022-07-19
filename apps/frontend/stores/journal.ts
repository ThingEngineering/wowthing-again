import { UserCount, WritableFancyStore } from '@/types'
import { JournalDataEncounter } from '@/types/data'
import getFilteredItems from '@/utils/journal/get-filtered-items'
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
        journalData: JournalData,
        journalState: JournalState,
        settingsData: Settings,
        staticData: StaticData,
        userTransmogData: UserTransmogData
    ): void {
        // console.time('JournalDataStore.setup')

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

                    if (!journalState.showTrash && encounter.name === 'Trash Drops') {
                        continue
                    }

                    for (const group of encounter.groups) {
                        const groupKey = `${encounterKey}--${group.name}`
                        const groupStats = stats[groupKey] = new UserCount()

                        const items = getFilteredItems(
                            journalState,
                            settingsData,
                            null,
                            instanceExpansion,
                            group
                        )
                        for (const item of items) {
                            for (const appearance of item.appearances) {
                                const key = masochist ?
                                    `${item.id}_${appearance.modifierId}` :
                                    appearance.appearanceId.toString()

                                if (!overallSeen[key]) {
                                    overallStats.total++
                                }
                                if (!tierSeen[key]) {
                                    tierStats.total++
                                }
                                if (!instanceSeen[key]) {
                                    instanceStats.total++
                                }
                                encounterStats.total++
                                groupStats.total++

                                const userHas = masochist ?
                                    userTransmogData.sourceHas[key] :
                                    userTransmogData.userHas[appearance.appearanceId]
                                if (userHas) {
                                    if (!overallSeen[key]) {
                                        overallStats.have++
                                    }
                                    if (!tierSeen[key]) {
                                        tierStats.have++
                                    }
                                    if (!instanceSeen[key]) {
                                        instanceStats.have++
                                    }
                                    encounterStats.have++
                                    groupStats.have++
                                }

                                overallSeen[key] = true
                                tierSeen[key] = true
                                instanceSeen[key] = true

                                for (const difficulty of appearance.difficulties) {
                                    const instanceDifficultyKey = `${instanceKey}--${difficulty}`
                                    const instanceDifficultyStats = stats[instanceDifficultyKey] = stats[instanceDifficultyKey] || new UserCount()

                                    const encounterDifficultyKey = `${encounterKey}--${difficulty}`
                                    const encounterDifficultyStats = stats[encounterDifficultyKey] = stats[encounterDifficultyKey] || new UserCount()


                                    const itemKey = `${key}--${difficulty}`
                                    if (!instanceSeen[itemKey]) {
                                        instanceDifficultyStats.total++
                                        encounterDifficultyStats.total++

                                        if (userHas) {
                                            instanceDifficultyStats.have++
                                            encounterDifficultyStats.have++
                                        }
                                    }

                                    instanceSeen[itemKey] = true
                                }
                            }
                        }
                    }
                }
            }
        }

        // console.log(masochist, stats)

        this.update((state) => {
            state.data.stats = stats
            return state
        })

        // console.timeEnd('JournalDataStore.setup')
    }
}

export const journalStore = new JournalDataStore()
