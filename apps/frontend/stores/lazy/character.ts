import { DateTime } from 'luxon'

import { Constants } from '@/data/constants'
import { dragonflightProfessionMap } from '@/data/professions'
import { professionCooldowns, professionWorkOrders } from '@/data/professions/cooldowns'
import { forcedReset, progressQuestMap } from '@/data/quests'
import { multiTaskMap, taskMap } from '@/data/tasks'
import { CharacterFlag } from '@/enums/character-flag'
import { Profession } from '@/enums/profession'
import { QuestStatus } from '@/enums/quest-status'
import { getNextDailyResetFromTime } from '@/utils/get-next-reset'
import type { Character, ProfessionCooldown, ProfessionCooldownQuest, ProfessionCooldownSpell, UserData } from '@/types'
import type { UserQuestData, UserQuestDataCharacterProgress } from '@/types/data'
import type { Settings } from '@/shared/stores/settings/types'


export interface LazyCharacter {
    chores: Record<string, LazyCharacterChore>
    tasks: Record<string, LazyCharacterTask>
    professionCooldowns: LazyCharacterCooldowns
    professionWorkOrders: LazyCharacterCooldowns
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
export class LazyCharacterCooldowns {
    anyFull = false
    anyHalf = false
    have = 0
    total = 0
    cooldowns: ProfessionCooldown[] = []
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
            professionCooldowns: checkCooldowns(stores, character, professionCooldowns),
            professionWorkOrders: checkCooldowns(stores, character, professionWorkOrders, CharacterFlag.IgnoreWorkOrders),
        }

        for (const view of stores.settings.views) {
            for (const taskName of view.homeTasks) {
                const task = taskMap[taskName]
                if (!task) {
                    continue
                }
                if (character.level < (task.minimumLevel || Constants.characterMaxLevel)) {
                    continue
                }

                if (task.type === 'multi') {
                    const charChore = new LazyCharacterChore()
                    const disabledChores = (view.disabledChores?.[taskName] || [])

                    // ugh
                    for (const choreTask of multiTaskMap[taskName]) {
                        if (character.level < (choreTask.minimumLevel || Constants.characterMaxLevel)) {
                            continue
                        }
                        if (choreTask.couldGetFunc?.(character) === false) {
                            continue
                        }

                        const charTask = new LazyCharacterChoreTask(
                            stores.userQuestData.characters[character.id]?.progressQuests?.[choreTask.taskKey]
                        )

                        if (disabledChores.indexOf(choreTask.taskKey) >= 0 &&
                            charTask.quest?.status !== QuestStatus.Completed) {
                            continue
                        }

                        if (!charTask.quest &&
                            choreTask.taskKey.endsWith('Treatise') &&
                            !stores.settings.professions.dragonflightTreatises) {
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
                                nameParts[1] === 'Drops' &&
                                charTask.status !== QuestStatus.Completed
                            )
                            ||
                            (
                                !stores.settings.professions.dragonflightCountGathering &&
                                isGathering &&
                                ['Gather'].indexOf(nameParts[1]) >= 0 &&
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
                                            DateTime.fromSeconds(progressQuest.expires) > stores.currentTime) {
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
                                    charTask.quest.objectives?.length > 0) {
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
                            
                            let objectives = charTask.quest.objectives || []
                            if (objectives.length === 1) {
                                const objective = charTask.quest.objectives[0]
                                if (objective.type === 'progressbar') {
                                    charTask.text = `${objective.have} %`
                                }
                                else if (questKey === 'weeklyHoliday' || questKey === 'weeklyPvp') {
                                    charTask.text = `${objective.have} / ${objective.need}`
                                }
                                else {
                                    charTask.text = `${Math.floor(Math.min(objective.have, objective.need) / objective.need * 100)} %`
                                }
        
                                if (objective.have === objective.need) {
                                    charTask.status = `${charTask.status} status-turn-in`
                                }
                            }
                            else {
                                if (
                                    ([75859, 78446, 78447].indexOf(charTask.quest.id) >= 0) &&
                                    objectives[0].have === 1 &&
                                    objectives[0].need === 1
                                ) {
                                    objectives = objectives.slice(1)
                                }

                                const averagePercent = objectives
                                    .reduce((a, b) => (a + (Math.min(b.have, b.need) / b.need)), 0) / objectives.length
        
                                charTask.text = `${Math.floor(averagePercent * 100)} %`
        
                                if (averagePercent >= 1) {
                                    charTask.status = `${charTask.status} status-turn-in`
                                }
                            }
                        }
                    }
        
                    if (charTask.status === undefined) {
                        charTask.status = 'fail'
                        charTask.text = 'Get!'
                    }

                    ret[character.id].tasks[`${view.id}|${taskName}`] = charTask
                }
            } // choreTask of choreTasks
        } // view of views
    }

    console.timeEnd('doCharacters')

    return ret
}

function checkCooldowns(
    stores: LazyStores,
    character: Character,
    cooldownDatas: (ProfessionCooldownQuest | ProfessionCooldownSpell)[],
    useFlag: CharacterFlag = CharacterFlag.None
): LazyCharacterCooldowns {
    const ret = new LazyCharacterCooldowns()

    const flags = stores.settings.characters.flags[character.id] || 0
    if ((flags & useFlag) === 0) {
        for (const cooldownData of cooldownDatas) {
            if (stores.settings.professions.cooldowns[cooldownData.key] === false) {
                continue
            }
            if (!character.professions?.[cooldownData.profession]) {
                continue
            }

            if (cooldownData.type === 'quest') {
                const progressQuest = stores.userQuestData.characters[character.id]?.progressQuests?.[cooldownData.key]
                let full: DateTime = undefined
                let have = 1
                if (progressQuest) {
                    const expires = DateTime.fromSeconds(progressQuest.expires)
                    if (expires > stores.currentTime) {
                        full = getNextDailyResetFromTime(expires, character.realm.region)
                        have = 0
                    }
                }
                
                ret.have += have
                ret.total++
                if (have) {
                    ret.anyFull = true
                }

                ret.cooldowns.push({
                    data: cooldownData,
                    have,
                    max: 1,
                    full,
                    seconds: 86400,
                })
            }
            else if (cooldownData.type === 'spell') {
                const charCooldown = character.professionCooldowns?.[cooldownData.key]
                if (!charCooldown) {
                    continue
                }

                let seconds = 0
                for (const [tierSeconds, tierSubProfessionId, tierTraitId, tierMinimum] of cooldownData.cooldown) {
                    if (seconds === 0) {
                        seconds = tierSeconds
                    }
                    else {
                        const charTrait = character.professionTraits?.[tierSubProfessionId]?.[tierTraitId]
                        if (charTrait && charTrait >= tierMinimum) {
                            seconds = tierSeconds
                        }
                    }
                }

                const [charNext, , charMax] = charCooldown
                let [, charHave] = charCooldown
                let charFull: DateTime = undefined

                // if the next charge timestamp is in the past, add up to max charges and work
                // out when this character will be full
                if (charNext > 0) {
                    charFull = DateTime.fromSeconds(charNext + ((charMax - charHave - 1) * seconds))
                    const diff = Math.floor(stores.currentTime.diff(DateTime.fromSeconds(charNext)).toMillis() / 1000)
                    if (diff > 0) {
                        charHave = Math.min(charMax, charHave + 1 + Math.floor(diff / seconds))
                    }
                }

                ret.have += charHave
                ret.total += charMax

                const per = charHave / charMax * 100
                if (per === 100) {
                    ret.anyFull = true
                }
                else if (per >= 50) {
                    ret.anyHalf = true
                }

                ret.cooldowns.push({
                    data: cooldownData,
                    have: charHave,
                    max: charMax,
                    full: charFull,
                    seconds,
                })
            }
        }
    }

    return ret
}
