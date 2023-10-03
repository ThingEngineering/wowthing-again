import type { QuestStatus } from '@/enums/quest-status'


export interface UserQuestData {
    accountHas: Set<number>
    account: number[]
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
    dailyQuests?: Set<number>
    quests?: Set<number>
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
