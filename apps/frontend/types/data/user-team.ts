export interface UserTeamData {
    teams: Record<number, UserTeamDataTeam>;
}

export interface UserTeamDataTeam {
    id: number;
    name: string;
    slug: string;
}
