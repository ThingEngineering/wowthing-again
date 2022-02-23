export interface UserQuestData {
    characters: Record<number, UserQuestDataCharacter>
}

export interface UserQuestDataCharacter {
    scannedAt: string

    callingCompleted: boolean[]
    callingExpires: number[]
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
    status: number
    text: string
    type: string
}
