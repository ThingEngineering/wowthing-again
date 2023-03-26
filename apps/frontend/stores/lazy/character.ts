import { DateTime } from 'luxon'

import { Constants } from '@/data/constants'
import { forcedReset, progressQuestMap } from '@/data/quests'
import { taskMap } from '@/data/tasks'
import type { Settings, UserData } from '@/types'
import type { UserQuestData, UserQuestDataCharacterProgress } from '@/types/data'
import { QuestStatus } from '@/enums'


export interface LazyCharacter {
    tasks: Record<string, LazyCharacterTask>
}
export interface LazyCharacterTask {
    quest: UserQuestDataCharacterProgress
    status: string
    text: string
}

interface LazyStores {
    currentTime: DateTime
    settings: Settings
    userData: UserData
    userQuestData: UserQuestData
}

export function doCharacters(stores: LazyStores): Record<string, LazyCharacter> {
    // console.time('doCharacters')

    const ret: Record<string, LazyCharacter> = {}

    for (const character of stores.userData.characters) {
        ret[character.id] = {
            tasks: {}
        }

        for (const taskName of stores.settings.layout.homeTasks) {
            const task = taskMap[taskName]
            if (!task) {
                continue
            }

            if (task.type === 'multi') {
                // ugh
            }
            else {
                // still ugh
                if (character.level < (task.minimumLevel || Constants.characterMaxLevel)) {
                    continue
                }

                const questKey = progressQuestMap[taskName] || taskName
                
                const charTask: LazyCharacterTask = {
                    quest: stores.userQuestData.characters[character.id]?.progressQuests?.[questKey],
                    status: undefined,
                    text: undefined,
                }
                
                if (charTask.quest) {
                    const expires = DateTime.fromSeconds(charTask.quest.expires)
                    if (forcedReset[questKey]) {
                        // quest always resets even if incomplete
                        if (expires < stores.currentTime) {
                            charTask.quest.status = QuestStatus.NotStarted
                        }
                    }
                    else {
                        // quest was completed and it's a new week
                        if (charTask.quest.status === QuestStatus.Completed && expires < stores.currentTime) {
                            charTask.quest.status = QuestStatus.NotStarted
                        }
                    }
    
                    if (charTask.quest.status === QuestStatus.Completed) {
                        charTask.status = 'success'
                        charTask.text = 'Done'
                    }
                    else if (charTask.quest.status === QuestStatus.InProgress) {
                        charTask.status = 'shrug'
                        
                        const objectives = charTask.quest.objectives || []
                        if (objectives.length === 1) {
                            const objective = charTask.quest.objectives[0]
                            if (objective.type === 'progressbar') {
                                charTask.text = `${objective.have} %`
                            }
                            else if (questKey === 'weeklyHoliday' || questKey === 'weeklyPvp') {
                                charTask.text = `${objective.have} / ${objective.need}`
                            }
                            else {
                                charTask.text = `${Math.floor(objective.have / objective.need * 100)} %`
                            }
    
                            if (objective.have === objective.need) {
                                charTask.status = `${status} status-turn-in`
                            }
                        }
                        else {
                            const averagePercent = objectives
                                .reduce((a, b) => (a + (b.have / b.need)), 0) / objectives.length
    
                                charTask.text = `${Math.floor(averagePercent * 100)} %`
    
                            if (averagePercent >= 1) {
                                charTask.status = `${status} status-turn-in`
                            }
                        }
                    }
                }
    
                if (charTask.status === undefined) {
                    charTask.status = 'fail'
                    charTask.text = 'Get!'
                }

                ret[character.id].tasks[taskName] = charTask
            }
        }
    }

    // console.timeEnd('doCharacters')

    return ret
}
