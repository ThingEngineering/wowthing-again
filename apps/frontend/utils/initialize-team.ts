import type { TeamData } from '@/types';

export default function initializeTeam(teamData: TeamData): void {
    console.time('initializeTeam');
    console.log(teamData);
    console.timeEnd('initializeTeam');
}
