export interface UserQuestData {
    characters: Record<number, UserQuestDataCharacter>
}

export interface UserQuestDataCharacter {
    dailyQuests?: Map<number, boolean>
    progressQuests?: Record<string, UserQuestDataCharacterProgress>
    quests?: Map<number, boolean>

    callingCompleted: boolean[]
    callingExpires: number[]
    dailyQuestsPacked: string
    questsPacked: string

    scannedAt: string
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
