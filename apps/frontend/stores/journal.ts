import flattenDeep from 'lodash/flattenDeep'
import uniq from 'lodash/uniq'
import without from 'lodash/without'

import { raidDifficulties } from '@/data/difficulty'
import { worldBossInstanceIds } from '@/data/dungeon'
import { JournalDataEncounter } from '@/types/data'
import { WritableFancyStore } from '@/types/fancy-store'
import type { JournalData, JournalDataTier } from '@/types/data'


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
}

export const journalStore = new JournalDataStore()
