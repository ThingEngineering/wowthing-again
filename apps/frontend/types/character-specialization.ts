import type {PrimaryStat, Role} from '@/types/enums'

export interface CharacterSpecialization {
    classId: number
    role: Role
    name: string
    icon: string
    mainStat: PrimaryStat
}
