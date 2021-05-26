import type { Role } from '@/data/role'

export interface CharacterSpecialization {
    classId: number
    role: Role
    name: string
    icon: string
}
