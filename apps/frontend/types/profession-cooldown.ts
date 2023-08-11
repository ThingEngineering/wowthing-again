import type { DateTime } from 'luxon'

import type { Profession } from '@/enums'


export interface ProfessionCooldown {
    data: ProfessionCooldownData
    have: number
    max: number
    seconds: number
    full: DateTime
}

export interface ProfessionCooldownData {
    key: string
    name: string
    profession: Profession
    cooldown: number[][]
}
