import type {Character, StaticDataProgressData, StaticDataProgressGroup} from '@/types'

export function getProgress(character: Character, group: StaticDataProgressGroup): ProgressInfo {
    let have = 0
    let total = 0

    let datas: StaticDataProgressData[]
    switch (group.lookup) {
        case 'covenant':
            datas = group.data[character.shadowlands?.covenantId]
            break

        default:
            datas = group.data[0]
            break
    }

    if (datas) {
        total = datas.length
        for (const data of datas) {
            if (group.type === 'quest' && character.quests.has(data.id)) {
                have++
            }
        }
    }

    return { datas, have, total }
}

interface ProgressInfo {
    datas: StaticDataProgressData[]
    have: number
    total: number
}
