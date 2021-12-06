import { UserCount, WritableFancyStore } from '@/types'
import type { JournalData, UserTransmogData } from '@/types/data'


export class JournalDataStore extends WritableFancyStore<JournalData> {
    get dataUrl(): string {
        return document
            .getElementById('app')
            ?.getAttribute('data-journal')
    }

    setup(
        journalData: JournalData,
        userTransmogData: UserTransmogData
    ): void {
        console.time('JournalDataStore.initialize')

        const stats: Record<string, UserCount> = {}

        const overallStats = stats['OVERALL'] = new UserCount()
        const overallSeen: Record<number, boolean> = {}

        for (const tier of journalData.tiers) {
            const tierStats = stats[tier.slug] = new UserCount()

            for (const instance of tier.instances) {
                const instanceKey = `${tier.slug}--${instance.slug}`
                const instanceStats = stats[instanceKey] = new UserCount()
                const instanceSeen: Record<number, boolean> = {}

                for (const encounter of instance.encounters) {
                    const encounterKey = `${instanceKey}--${encounter.name}`
                    const encounterStats = stats[encounterKey] = new UserCount()
                    const encounterSeen: Record<number, boolean> = {}

                    for (const item of encounter.items) {
                        for (const appearance of item.appearances) {
                            if (!overallSeen[appearance.appearanceId]) {
                                overallStats.total++
                            }

                            tierStats.total++

                            if (!instanceSeen[appearance.appearanceId]) {
                                instanceStats.total++
                            }
                            if (!encounterSeen[appearance.appearanceId]) {
                                encounterStats.total++
                            }

                            if (userTransmogData.userHas[appearance.appearanceId]) {
                                if (!overallSeen[appearance.appearanceId]) {
                                    overallStats.have++
                                }

                                tierStats.have++

                                if (!instanceSeen[appearance.appearanceId]) {
                                    instanceStats.have++
                                }
                                if (!encounterSeen[appearance.appearanceId]) {
                                    encounterStats.have++
                                }
                            }

                            overallSeen[appearance.appearanceId] = true
                            instanceSeen[appearance.appearanceId] = true
                            encounterSeen[appearance.appearanceId] = true
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
