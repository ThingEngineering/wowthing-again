import type { Profession } from '@/enums'


interface DragonflightProfessionQuest {
    itemId: number
    points?: number
    questId: number
    source?: string
}

export type DragonflightProfession = {
    id: Profession
    hasCraft?: boolean
    hasOrders?: boolean
    masterQuestId?: number

    bookQuests?: DragonflightProfessionQuest[]
    dropQuests?: DragonflightProfessionQuest[]
    treasureQuests?: DragonflightProfessionQuest[]
}
