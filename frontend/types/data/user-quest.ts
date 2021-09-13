export interface UserQuestData {
    characters: Record<number, UserQuestDataCharacter>
}

export interface UserQuestDataCharacter {
    dailyQuests?: Map<number, boolean>
    quests?: Map<number, boolean>
    weeklyQuests?: Map<number, boolean>

    dailyQuestsPacked: string
    questsPacked: string
    weeklyQuestsPacked: string
}
