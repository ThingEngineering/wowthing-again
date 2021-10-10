export interface UserTeamData {
    teams: Record<number, UserTeamDataTeam>
}

export interface UserTeamDataTeam {
    dailyQuests?: Map<number, boolean>
    quests?: Map<number, boolean>
    weeklyQuests?: Map<number, boolean>

    dailyQuestsPacked: string
    questsPacked: string
    weeklyQuestsPacked: string

    scannedAt: string
}
