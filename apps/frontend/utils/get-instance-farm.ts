import sortBy from 'lodash/sortBy'

import { journalDifficultyOrder } from '@/data/difficulty'
import { RewardType } from '@/types/enums'
import type { FarmStatus } from '@/types'
import type { JournalData, JournalDataInstance } from '@/types/data'
import type { ManualDataZoneMapDrop, ManualDataZoneMapFarm } from '@/types/data/manual'
import type { StaticData } from '@/types/data/static'
import leftPad from './left-pad'


export function getInstanceFarm(
    journalData: JournalData,
    staticData: StaticData,
    farm: ManualDataZoneMapFarm
): [FarmStatus, ManualDataZoneMapDrop[]] {
    const drops: ManualDataZoneMapDrop[] = []
    const status: FarmStatus = {
        characters: [],
        drops: [],
        need: false,
    }

    let instance: JournalDataInstance
    for (const tier of journalData.tiers.filter((tier) => tier !== null)) {
        const instances = tier.instances.filter((instance) => instance.id === farm.id)
        if (instances.length > 0) {
            instance = instances[0]
            
            const instanceKey = `${tier.slug}--${instance.slug}`
            const stats = journalData.stats[instanceKey]
            status.link = `${tier.slug}/${instance.slug}`
            status.need = stats.have < stats.total

            const difficulties: Set<number> = new Set()
            for (const encounter of instance.encounters) {
                for (const group of encounter.groups) {
                    for (const item of group.items) {
                        for (const appearance of item.appearances) {
                            for (const difficulty of appearance.difficulties) {
                                difficulties.add(difficulty)
                            }
                        }
                    }
                }
            }

            const sortedDifficulties = sortBy(
                Array.from(difficulties.values()),
                (diff) => journalDifficultyOrder.indexOf(diff)
            )
            for (const difficulty of sortedDifficulties) {
                const difficultyKey = `${instanceKey}--${difficulty}`
                const difficultyStats = journalData.stats[difficultyKey]

                status.drops.push({
                    need: difficultyStats.have < difficultyStats.total,
                    skip: false,
                    validCharacters: true,
                    characterIds: [],
                    completedCharacterIds: [],
                })

                drops.push({
                    id: difficulty,
                    type: RewardType.InstanceSpecial,
                    subType: 0,
                    classMask: 0,
                    limit: [`<code>${leftPad(difficultyStats.have, 3)} / ${leftPad(difficultyStats.total, 3)}</code>`],
                })
            }
            
            break
        }
    }

    return [status, drops]
}
