import type { Role } from '@/types/enums'

export interface CharacterSpecialization {
    classId: number
    role: Role
    name: string
    icon: string
}
