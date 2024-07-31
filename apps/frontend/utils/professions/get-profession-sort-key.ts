import { isGatheringProfession } from '@/data/professions'
import type { StaticDataProfession } from '@/shared/stores/static/types'


export function getProfessionSortKey(profession: Partial<StaticDataProfession>): string {
    return `${profession.type}${isGatheringProfession[profession.id] ? 1 : 0}${profession.name}`
}
