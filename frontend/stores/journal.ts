import { UserCount, WritableFancyStore } from '@/types'
import { JournalDataEncounterItem } from '@/types/data'
import getFilteredItems from '@/utils/journal/get-filtered-items'
import type { JournalState } from '@/stores/local-storage'
import type { Settings } from '@/types'
import type { JournalData, UserTransmogData } from '@/types/data'


export class JournalDataStore extends WritableFancyStore<JournalData> {
    get dataUrl(): string {
        return document
            .getElementById('app')
            ?.getAttribute('data-journal')
    }

    initialize(data: JournalData): void {
        for (const tier of data.tiers) {
            for (const instance of tier.instances) {
                for (const encounter of instance.encounters) {
                    for (const group of encounter.groups) {
                        if (group.itemsRaw) {
                            group.items = group.itemsRaw.map(
                                (itemArray) => new JournalDataEncounterItem(...itemArray)
                            )
                            group.itemsRaw = null
                        }
                    }
                }
            }
        }
    }

    setup(
        journalData: JournalData,
        journalState: JournalState,
        settingsData: Settings,
        userTransmogData: UserTransmogData
    ): void {
        console.time('JournalDataStore.initialize')

        const stats: Record<string, UserCount> = {}

        const overallStats = stats['OVERALL'] = new UserCount()
        const overallSeen: Record<number, boolean> = {}

        for (const tier of journalData.tiers) {
            const tierStats = stats[tier.slug] = new UserCount()
            const tierSeen: Record<number, boolean> = {}

            for (const instance of tier.instances) {
                const instanceKey = `${tier.slug}--${instance.slug}`
                const instanceStats = stats[instanceKey] = new UserCount()
                const instanceSeen: Record<number, boolean> = {}

                for (const encounter of instance.encounters) {
                    const encounterKey = `${instanceKey}--${encounter.name}`
                    const encounterStats = stats[encounterKey] = new UserCount()

                    for (const group of encounter.groups) {
                        const groupKey = `${encounterKey}--${group.name}`
                        const groupStats = stats[groupKey] = new UserCount()

                        const items = getFilteredItems(
                            journalState,
                            settingsData,
                            null,
                            group.items
                        )
                        for (const item of items) {
                            for (const appearance of item.appearances) {
                                if (!overallSeen[appearance.appearanceId]) {
                                    overallStats.total++
                                }
                                if (!tierSeen[appearance.appearanceId]) {
                                    tierStats.total++
                                }
                                if (!instanceSeen[appearance.appearanceId]) {
                                    instanceStats.total++
                                }
                                encounterStats.total++
                                groupStats.total++

                                if (userTransmogData.userHas[appearance.appearanceId]) {
                                    if (!overallSeen[appearance.appearanceId]) {
                                        overallStats.have++
                                    }
                                    if (!tierSeen[appearance.appearanceId]) {
                                        tierStats.have++
                                    }
                                    if (!instanceSeen[appearance.appearanceId]) {
                                        instanceStats.have++
                                    }
                                    encounterStats.have++
                                    groupStats.have++
                                }

                                overallSeen[appearance.appearanceId] = true
                                tierSeen[appearance.appearanceId] = true
                                instanceSeen[appearance.appearanceId] = true
                            }
                        }
                    }
                }
            }
        }

        this.update((state) => {
            state.data.stats = stats
            return state
        })

        console.timeEnd('JournalDataStore.initialize')
    }
}

export const journalStore = new JournalDataStore()
