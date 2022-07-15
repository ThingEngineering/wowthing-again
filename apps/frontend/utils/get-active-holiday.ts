import { holidayQuestCycle } from '@/data/quests'
import type { UserData } from '@/types'


export function getActiveHoliday(userData: UserData): string {
    const currentPeriod = userData.currentPeriod[1].id
    return holidayQuestCycle[(currentPeriod - 860) % holidayQuestCycle.length]
}
