import { DateTime } from 'luxon'

import { Constants } from '@/data/constants'
import { dragonflightProfessionMap } from '@/data/professions'
import { forcedReset, progressQuestMap } from '@/data/quests'
import { multiTaskMap, taskMap } from '@/data/tasks'
import { Profession } from '@/enums/profession'
import { QuestStatus } from '@/enums/quest-status'
import type { Settings, UserData } from '@/types'
import type { UserQuestData, UserQuestDataCharacterProgress } from '@/types/data'


export interface LazyCharacter {
    chores: Record<string, LazyCharacterChore>
    tasks: Record<string, LazyCharacterTask>
}
export class LazyCharacterChore {
    countCompleted = 0
    countStarted = 0
    countTotal = 0
    name: string
    status = QuestStatus.NotStarted
    tasks: LazyCharacterChoreTask[] = []
}
export class LazyCharacterChoreTask {
    name: string
    skipped = false
    status: QuestStatus = QuestStatus.NotStarted
    statusTexts: string[] = []

    constructor(
        public quest: UserQuestDataCharacterProgress
    )
    { }
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
    console.time('doCharacters')

    const ret: Record<string, LazyCharacter> = {}

    for (const character of stores.userData.characters) {
        ret[character.id] = {
            chores: {},
            tasks: {},
        }

        for (const taskName of stores.settings.layout.homeTasks) {
            const task = taskMap[taskName]
            if (!task) {
                continue
            }
            if (character.level < (task.minimumLevel || Constants.characterMaxLevel)) {
                continue
            }

            if (task.type === 'multi') {
                const charChore = new LazyCharacterChore()

                // ugh
                for (const choreTask of multiTaskMap[taskName]) {
                    if (character.level < (choreTask.minimumLevel || Constants.characterMaxLevel)) {
                        continue
                    }
                    if ((stores.settings.tasks.disabledChores?.[taskName] || []).indexOf(choreTask.taskKey) >= 0) {
                        continue
                    }
                    if (choreTask.couldGetFunc?.(character) === false) {
                        continue
                    }

                    const charTask = new LazyCharacterChoreTask(
                        stores.userQuestData.characters[character.id]?.progressQuests?.[choreTask.taskKey]
                    )

                    if (!charTask.quest &&
                        choreTask.taskKey.endsWith('Treatise') &&
                        !stores.settings.professions.dragonflightTreatises)
                    {
                        continue
                    }

                    charTask.statusTexts.push(!charTask.quest ? choreTask.canGetFunc?.(character) || '' : '')

                    const nameParts = choreTask.taskName.split(': ')
                    if (['Cooking', 'Fishing'].indexOf(nameParts[0]) >= 0) {
                        continue
                    }

                    const isGathering = ['Herbalism', 'Mining', 'Skinning'].indexOf(nameParts[0]) >= 0
                    charTask.skipped = (
                        (
                            !stores.settings.professions.dragonflightCountCraftingDrops &&
                            !isGathering &&
                            nameParts[1] === 'Drops' &&
                            charTask.status !== QuestStatus.Completed
                        )
                        ||
                        (
                            !stores.settings.professions.dragonflightCountGathering &&
                            isGathering &&
                            ['Drops', 'Gather'].indexOf(nameParts[1]) >= 0 &&
                            charTask.status !== QuestStatus.Completed
                        )
                        ||
                        charTask.statusTexts[0] !== ''
                    )
        
                    if (!charTask.skipped) {
                        charChore.countTotal++
                    }

                    if (charTask.statusTexts[0].startsWith('Need')) {
                        charTask.status = QuestStatus.Error
                    }
                    else if (choreTask.taskKey.endsWith('Drop#')) {
                        charTask.statusTexts = []
                        let haveCount = 0
                        let needCount = 0
        
                        if (taskName === 'dfProfessionWeeklies') {
                            const professionName = choreTask.taskKey.replace('dfProfession', '').replace('Drop#', '')
                            const profession = Profession[professionName as keyof typeof Profession]
                            const professionData = dragonflightProfessionMap[profession]
                            
                            if (professionData.dropQuests?.length > 0) {
                                needCount = professionData.dropQuests.length
        
                                professionData.dropQuests.forEach((drop, index) => {
                                    const dropKey = choreTask.taskKey.replace('#', (index + 1).toString())
                                    const progressQuest = stores.userQuestData.characters[character.id]?.progressQuests?.[dropKey]
        
                                    let statusText = ''
                                    if (progressQuest?.status === QuestStatus.Completed &&
                                        DateTime.fromSeconds(progressQuest.expires) > stores.currentTime)
                                    {
                                        haveCount++
                                        statusText += '<span class="status-success">:yes:</span>'
                                    }
                                    else {
                                        statusText += '<span class="status-fail">:no:</span>'
                                    }
                                    
                                    statusText += `{item:${drop.itemId}}`
                                    statusText += ` <span class="status-shrug">(${drop.source})</span>`
        
                                    charTask.statusTexts.push(statusText)
                                })
                            }
                        }
        
                        if (charTask.statusTexts.length === 0) {
                            needCount = choreTask.taskName.match(/^(Herbalism|Mining|Skinning):/) ? 6 : 4
                            for (let dropIndex = 0; dropIndex < needCount; dropIndex++) {
                                const dropKey = choreTask.taskKey.replace('#', (dropIndex + 1).toString())
                                const progressQuest = stores.userQuestData.characters[character.id]?.progressQuests?.[dropKey]
                                if (progressQuest?.status === QuestStatus.Completed && DateTime.fromSeconds(progressQuest.expires) > stores.currentTime) {
                                    haveCount++
                                }
                            }
                        }
        
                        if (haveCount === needCount) {
                            charTask.status = QuestStatus.Completed
                        }
                        else {
                            charTask.status = QuestStatus.InProgress
                            if (charTask.statusTexts.length === 0) {
                                charTask.statusTexts.push(`${haveCount}/${needCount} Collected`)
                            }
                        }
                    }
                    else {
                        if (!!charTask.quest && DateTime.fromSeconds(charTask.quest.expires) > stores.currentTime) {
                            charTask.status = charTask.quest.status
                            if (charTask.status === QuestStatus.InProgress &&
                                charTask.quest.objectives?.length > 0)
                            {
                                charTask.statusTexts = charTask.quest.objectives.map((obj) => obj.text)
                            }
                        }
                    }

                    charTask.name = taskName === 'dfDungeonWeeklies'
                        ? stores.userQuestData.questNames[choreTask.taskKey] || choreTask.taskName
                        : choreTask.taskName
                    
                    if (!charTask.skipped) {
                        if (charTask.status === QuestStatus.Completed) {
                            charChore.countCompleted++
                        }
                        else if (charTask.status === QuestStatus.InProgress) {
                            charChore.countStarted++
                        }
                    }
                
                    charChore.tasks.push(charTask)
                }

                ret[character.id].chores[taskName] = charChore
            }
            else {
                // still ugh
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

    console.timeEnd('doCharacters')

    return ret
}
