import type { Profession } from '@/enums/profession'


interface DragonflightProfessionQuest {
    itemId: number
    points?: number
    questId: number
    source?: string
}

export type DragonflightProfession = {
    id: Profession
    hasOrders?: boolean
    hasTask?: boolean
    masterQuestId?: number

    bookQuests?: DragonflightProfessionQuest[]
    dropQuests?: DragonflightProfessionQuest[]
    treasureQuests?: DragonflightProfessionQuest[]
}
