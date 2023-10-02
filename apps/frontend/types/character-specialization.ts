import type { PrimaryStat } from '@/enums/primary-stat'
import type { Role } from '@/enums/role'


export interface CharacterSpecialization {
    classId: number
    role: Role
    name: string
    icon: string
    mainStat: PrimaryStat
}
