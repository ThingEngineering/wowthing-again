import { UserCount, WritableFancyStore } from '@/types'
import { JournalDataEncounterItem } from '@/types/data'
import type { Settings } from '@/types'
import type { JournalData, UserTransmogData } from '@/types/data'
import getFilteredItems from '@/utils/journal/get-filtered-items'


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
                    if (encounter.itemsRaw) {
                        encounter.items = encounter.itemsRaw.map(
                            (itemArray) => new JournalDataEncounterItem(...itemArray)
                        )
                        encounter.itemsRaw = null
                    }
                }
            }
        }
    }

    setup(
        journalData: JournalData,
        settingsData: Settings,
        userTransmogData: UserTransmogData
    ): void {
        console.time('JournalDataStore.initialize')

        const stats: Record<string, UserCount> = {}

        const overallStats = stats['OVERALL'] = new UserCount()

        for (const tier of journalData.tiers) {
            const tierStats = stats[tier.slug] = new UserCount()

            for (const instance of tier.instances) {
                const instanceKey = `${tier.slug}--${instance.slug}`
                const instanceStats = stats[instanceKey] = new UserCount()

                for (const encounter of instance.encounters) {
                    const encounterKey = `${instanceKey}--${encounter.name}`
                    const encounterStats = stats[encounterKey] = new UserCount()
                    
                    const items = getFilteredItems(settingsData, encounter.items)
                    for (const item of items) {
                        for (const appearance of item.appearances) {
                            overallStats.total++
                            tierStats.total++
                            instanceStats.total++
                            encounterStats.total++

                            if (userTransmogData.userHas[appearance.appearanceId]) {
                                overallStats.have++
                                tierStats.have++
                                instanceStats.have++
                                encounterStats.have++
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
