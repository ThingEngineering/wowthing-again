import type {MainStat, Role} from '@/types/enums'

export interface CharacterSpecialization {
    classId: number
    role: Role
    name: string
    icon: string
    mainStat: MainStat
}
