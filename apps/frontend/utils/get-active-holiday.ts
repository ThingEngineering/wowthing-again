import { holidayQuestCycle } from '@/data/quests'
import type { UserData } from '@/types'


export function getActiveHoliday(
    userData: UserData,
    region = 1
): string {
    const currentPeriod = userData.currentPeriod[region].id
    return holidayQuestCycle[(currentPeriod - 860) % holidayQuestCycle.length]
}
