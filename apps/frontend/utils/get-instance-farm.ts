import sortBy from 'lodash/sortBy'
import type { DateTime } from 'luxon'

import { journalDifficultyOrder } from '@/data/difficulty'
import { RewardType } from '@/enums/reward-type'
import { leftPad } from '@/utils/formatting'
import parseApiTime from '@/utils/parse-api-time'
import type { LazyStore } from '@/stores'
import type { FarmStatus, UserData } from '@/types'
import type { JournalData, JournalDataInstance } from '@/types/data'
import type { ManualDataZoneMapDrop, ManualDataZoneMapFarm } from '@/types/data/manual'


export function getInstanceFarm(
    currentTime: DateTime,
    journalData: JournalData,
    lazyData: LazyStore,
    userData: UserData,
    farm: ManualDataZoneMapFarm
): [FarmStatus, ManualDataZoneMapDrop[]] {
    const drops: ManualDataZoneMapDrop[] = []
    const status: FarmStatus = {
        characters: [],
        drops: [],
        need: false,
    }

    const characterData: Record<number, boolean> = {}
    let instance: JournalDataInstance
    for (const tier of journalData.tiers.filter((tier) => tier !== null)) {
        const instances = tier.instances.filter((instance) => instance?.id === farm.id)
        if (instances.length > 0) {
            instance = instances[0]
            
            const instanceKey = `${tier.slug}--${instance.slug}`
            const stats = lazyData.journal.stats[instanceKey]
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
                const difficultyStats = lazyData.journal.stats[difficultyKey]
                if (!difficultyStats) {
                    console.log(`no difficulty stats for key "${difficultyKey}"`)
                    continue
                }

                const characterIds: number[] = []
                const completedCharacterIds: number[] = []
                const lockoutKey = `${instance.id}-${difficulty}`
                for (const character of userData.characters.filter((char) => char.level > 10)) {
                    const lockout = character.lockouts?.[lockoutKey]
                    if (lockout) {
                        if (parseApiTime(lockout.resetTime) > currentTime) {
                            completedCharacterIds.push(character.id)
                        }
                        else {
                            characterIds.push(character.id)
                        }
                    }
                    else {
                        characterIds.push(character.id)
                    }
                    
                    characterData[character.id] = true
                }

                status.drops.push({
                    need: difficultyStats.have < difficultyStats.total,
                    skip: false,
                    validCharacters: true,
                    characterIds,
                    completedCharacterIds,
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

    status.characters = Object.keys(characterData)
        .map((characterId) => ({
            id: parseInt(characterId),
            types: [RewardType.InstanceSpecial],
        }))

    return [status, drops]
}
