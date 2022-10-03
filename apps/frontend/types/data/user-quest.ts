import type { QuestStatus } from '@/enums'


export interface UserQuestData {
    characters: Record<number, UserQuestDataCharacter>
}

export interface UserQuestDataCharacter {
    scannedAt: string

    dailies: Record<number, number[][]>
    dailyQuestList: number[]
    questList: number[]
    progressQuests?: Record<string, UserQuestDataCharacterProgress>

    // Computed
    dailyQuests?: Map<number, boolean>
    quests?: Map<number, boolean>
}

export interface UserQuestDataCharacterProgress {
    expires: number
    have: number
    id: number
    name: string
    need: number
    status: QuestStatus
    text: string
    type: string
}
