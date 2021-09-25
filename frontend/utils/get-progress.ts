import {get} from 'svelte/store'

import type {Character, StaticDataProgressData, StaticDataProgressGroup} from '@/types'
import {covenantMap} from '@/data/covenant'
import {userQuestStore} from '@/stores'

export default function getProgress(character: Character, group: StaticDataProgressGroup): ProgressInfo {
    const userQuestData = get(userQuestStore).data
    let have = 0
    let total = 0
    let icon = ''

    let datas: StaticDataProgressData[]
    switch (group.lookup) {
        case 'covenant':
            datas = group.data[character.shadowlands?.covenantId]
            if (datas) {
                icon = covenantMap[character.shadowlands.covenantId].icon
            }
            break

        default:
            datas = group.data[0]
            break
    }

    if (datas) {
        total = datas.length
        for (const data of datas) {
            if (group.type === 'quest' && userQuestData.characters[character.id]?.quests?.has(data.id)) {
                have++
            }
        }
    }

    return { datas, have, icon, total }
}

interface ProgressInfo {
    datas: StaticDataProgressData[]
    have: number
    icon: string
    total: number
}
