export interface UserQuestData {
    characters: Record<number, UserQuestDataCharacter>
}

export interface UserQuestDataCharacter {
    dailyQuests?: Map<number, boolean>
    quests?: Map<number, boolean>
    weeklyQuests?: Map<number, boolean>

    callingCompleted: boolean[]
    callingExpires: number[]
    dailyQuestsPacked: string
    otherQuestsPacked: string
    questsPacked: string
    weeklyQuestsPacked: string

    scannedAt: string
}
