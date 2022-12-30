import type { QuestStatus } from '@/enums'


export interface UserQuestData {
    characters: Record<number, UserQuestDataCharacter>

    questNames: Record<string, string>
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
    id: number
    name: string
    status: QuestStatus
    objectives: UserQuestDataCharacterProgressObjective[]
}

export interface UserQuestDataCharacterProgressObjective {
    have: number
    need: number
    text: string
    type: string
}
