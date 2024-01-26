import { DateTime } from 'luxon'

import { Constants } from '@/data/constants'
import { expansionOrder } from '@/data/expansion'
import { dragonflightProfessionMap, professionSlugToId, professionSpecializationSpells } from '@/data/professions'
import { professionCooldowns, professionWorkOrders } from '@/data/professions/cooldowns'
import { forcedReset, progressQuestMap } from '@/data/quests'
import { multiTaskMap, taskMap } from '@/data/tasks'
import { CharacterFlag } from '@/enums/character-flag'
import { Faction } from '@/enums/faction'
import { Profession } from '@/enums/profession'
import { QuestStatus } from '@/enums/quest-status'
import { getNextDailyResetFromTime } from '@/utils/get-next-reset'
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries'
import { UserCount, type Character, type ProfessionCooldown, type ProfessionCooldownQuest, type ProfessionCooldownSpell, type UserData } from '@/types'
import type { Settings } from '@/shared/stores/settings/types'
import type { StaticData, StaticDataProfessionAbility, StaticDataProfessionCategory, StaticDataSubProfessionTraitNode } from '@/shared/stores/static/types'
import type { UserQuestData, UserQuestDataCharacterProgress } from '@/types/data'


export interface LazyCharacter {
    chores: Record<string, LazyCharacterChore>
    tasks: Record<string, LazyCharacterTask>
    professionCooldowns: LazyCharacterCooldowns
    professionWorkOrders: LazyCharacterCooldowns
    professions: LazyCharacterProfessions
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
export class LazyCharacterProfessions {
    knownRecipes: Set<number> = new Set<number>()
    professions: Record<number, LazyCharacterProfession> = {}
}
export class LazyCharacterProfession {
    filteredCategories: Record<number, StaticDataProfessionAbility[]> = {}
    stats: UserCount = new UserCount()
    subProfessions: Record<number, LazyCharacterSubProfession> = {}

    constructor(
        public professionId: number
    ) { }
}

export class LazyCharacterSubProfession {
    stats: UserCount = new UserCount()
    traitStats?: UserCount
}

interface LazyStores {
    currentTime: DateTime
    settings: Settings
    staticData: StaticData,
    userData: UserData
    userQuestData: UserQuestData
}

export function doCharacters(stores: LazyStores): Record<string, LazyCharacter> {
    console.time('doCharacters')

    const ret: Record<string, LazyCharacter> = {}

    for (const character of stores.userData.characters) {
        const characterData = ret[character.id] = {
            chores: {},
            tasks: {},
            professionCooldowns: doProfessionCooldowns(stores, character, professionCooldowns),
            professionWorkOrders: doProfessionCooldowns(stores, character, professionWorkOrders, CharacterFlag.IgnoreWorkOrders),
            professions: new LazyCharacterProfessions(),
        }

        const professions = new ProcessCharacterProfessions(stores, character, characterData.professions)
        professions.process()

        doCharacterTasks(stores, character, characterData)
    }

    console.timeEnd('doCharacters')

    return ret
}

class ProcessCharacterProfessions {
    private currentProfession: LazyCharacterProfession
    private currentSubProfession: LazyCharacterSubProfession

    constructor(
        private stores: LazyStores,
        private character: Character,
        private characterData: LazyCharacterProfessions
    ) { }

    public process() {
        for (const [professionId, characterSubProfessions] of getNumberKeyedEntries(this.character.professions || {})) {
            const staticProfession = this.stores.staticData.professions[professionId]
            if (staticProfession.type !== 0) { continue }
    
            for (const subProfession of Object.values(characterSubProfessions)) {
                for (const abilityId of subProfession.knownRecipes) {
                    this.characterData.knownRecipes.add(abilityId)
                }
            }
    
            this.currentProfession = this.characterData.professions[professionId] = new LazyCharacterProfession(professionId)
    
            for (const expansion of expansionOrder) {
                const subProfession = staticProfession.subProfessions[expansion.id]
                if (!subProfession) { continue }
                
                // const characterSubProfession = characterSubProfessions[subProfession.id]
                // if (!characterSubProfession) { continue }

                this.currentSubProfession = this.currentProfession.subProfessions[subProfession.id] = new LazyCharacterSubProfession()
    
                let rootCategory = staticProfession.categories?.[expansion.id]
                if (rootCategory) {
                    while (rootCategory.children.length === 1) {
                        rootCategory = rootCategory.children[0]
                    }
                }
    
                this.recurseCategory(rootCategory)

                if (subProfession.traitTrees) {
                    this.currentSubProfession.traitStats = new UserCount()

                    const charTraits = this.character.professionTraits?.[subProfession.id] || {}
                    for (const traitTree of subProfession.traitTrees) {
                        this.recurseTraits(charTraits, traitTree.firstNode)
                    }
                }
            }
        }    
    }

    private recurseCategory(category: StaticDataProfessionCategory) {
        const filteredCategory: StaticDataProfessionAbility[] = this.currentProfession.filteredCategories[category.id] = []
    
        for (const ability of (category.abilities || [])) {
            if (ability.faction !== Faction.Neutral && ability.faction !== this.character.faction) {
                continue
            }
    
            const requiredAbility = this.stores.staticData.itemToRequiredAbility[ability.itemIds[0]]
            if (professionSpecializationSpells[requiredAbility]) {
                const charSpecialization = this.character.professionSpecializations[this.currentProfession.professionId]
                if (charSpecialization !== undefined && charSpecialization !== requiredAbility) {
                    continue
                }
            }
    
            filteredCategory.push(ability)
    
            if (ability.extraRanks) {
                this.currentProfession.stats.total += (ability.extraRanks.length + 1)
                this.currentSubProfession.stats.total += (ability.extraRanks.length + 1)
    
                for (let rankIndex = ability.extraRanks.length - 1; rankIndex >= 0; rankIndex--) {
                    if (this.characterData.knownRecipes.has(ability.extraRanks[rankIndex][0])) {
                        this.currentProfession.stats.have += (rankIndex + 2)
                        this.currentSubProfession.stats.have += (rankIndex + 2)
                        break
                    }
                }
                if (this.characterData.knownRecipes.has(ability.id)) {
                    this.currentProfession.stats.have++
                    this.currentSubProfession.stats.have++
                }
            }
            else {
                this.currentProfession.stats.total++
                this.currentSubProfession.stats.total++

                if (this.characterData.knownRecipes.has(ability.id)) {
                    this.currentProfession.stats.have++
                    this.currentSubProfession.stats.have++
                }
            }
        }
    
        for (const child of (category.children || [])) {
            this.recurseCategory(child)
        }
    }

    private recurseTraits(charTraits: Record<number, number>, node: StaticDataSubProfessionTraitNode) {
        this.currentSubProfession.traitStats.have += ((charTraits[node.nodeId] || 1) - 1)
        this.currentSubProfession.traitStats.total += node.rankMax
        
        for (const childNode of (node.children || [])) {
            this.recurseTraits(charTraits, childNode)
        }
    }
}

function doCharacterTasks(
    stores: LazyStores,
    character: Character,
    characterData: LazyCharacter
) {
    for (const view of stores.settings.views) {
        for (const taskName of view.homeTasks) {
            const task = taskMap[taskName]
            if (
                !task ||
                (character.level < (task.minimumLevel || Constants.characterMaxLevel)) ||
                (character.level > (task.maximumLevel || Constants.characterMaxLevel))
            ) {
                continue
            }

            if (task.type === 'multi') {
                const charChore = new LazyCharacterChore()
                const disabledChores = (view.disabledChores?.[taskName] || [])

                // ugh
                for (const choreTask of multiTaskMap[taskName]) {
                    if (
                        (character.level < (choreTask.minimumLevel || Constants.characterMaxLevel)) ||
                        (character.level > (choreTask.maximumLevel || Constants.characterMaxLevel)) ||
                        (choreTask.couldGetFunc?.(character) === false)
                    ){
                        continue
                    }

                    if (choreTask.taskKey.endsWith('Split')) {
                        choreTask.taskKey = choreTask.taskKey.slice(0, -5);
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

                    let skipTraits = false
                    if (
                        stores.settings.professions.ignoreTasksWhenDoneWithTraits &&
                        choreTask.taskKey.startsWith('dfProfession')
                    ) {
                        const professionId = professionSlugToId[nameParts[0].toLocaleLowerCase()]
                        if (professionId) {
                            const dfProfession = dragonflightProfessionMap[professionId]
                            const traitStats = characterData.professions
                                .professions[professionId]
                                ?.subProfessions[dfProfession.subProfessionId]
                                ?.traitStats
                            if (traitStats && traitStats.percent === 100) {
                                skipTraits = true
                            }
                        }
                    }
                
                    const isGathering = ['Herbalism', 'Mining', 'Skinning'].indexOf(nameParts[0]) >= 0
                    charTask.skipped = charTask.status !== QuestStatus.Completed && (
                        (
                            !stores.settings.professions.dragonflightCountCraftingDrops &&
                            nameParts[1] === 'Drops'
                        ) ||
                        (
                            !stores.settings.professions.dragonflightCountTasks &&
                            nameParts[1] === 'Task'
                        ) ||
                        (
                            !stores.settings.professions.dragonflightCountGathering &&
                            isGathering &&
                            ['Gather'].indexOf(nameParts[1]) >= 0
                        ) ||
                        charTask.statusTexts[0] !== '' ||
                        skipTraits
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
                                        statusText += '<span class="status-success">:starFull:</span>'
                                    }
                                    else {
                                        statusText += '<span class="status-fail">:starEmpty:</span>'
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
                        if (!!charTask.quest && (
                            (DateTime.fromSeconds(charTask.quest.expires) > stores.currentTime) ||
                            (choreTask.taskKey.startsWith('dmf') && charTask.quest.expires === 0)
                        )) {
                            charTask.status = charTask.quest.status
                            if (charTask.status === QuestStatus.InProgress &&
                                charTask.quest.objectives?.length > 0
                            ) {
                                // charTask.statusTexts = charTask.quest.objectives.map((obj) => obj.text)
                                charTask.statusTexts = []
                                for (const objective of charTask.quest.objectives) {
                                    if (objective.have === objective.need && objective.text.includes('"Enter the Dream"')) {
                                        continue
                                    }
                                    if (objective.have === 0 && objective.text.endsWith('(Optional)')) {
                                        continue
                                    }

                                    let statusText = ''
                                    if (objective.have === objective.need) {
                                        statusText += '<span class="status-success">:starFull:</span>'
                                    }
                                    else if (objective.have > 0) {
                                        statusText += '<span class="status-shrug">:starHalf:</span>'
                                    }
                                    else {
                                        statusText += '<span class="status-fail">:starEmpty:</span>'
                                    }
                                    statusText += ` ${objective.text}`

                                    charTask.statusTexts.push(statusText)
                                }
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

                characterData.chores[taskName] = charChore
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

                characterData.tasks[`${view.id}|${taskName}`] = charTask
            }
        } // choreTask of choreTasks
    } // view of views
}

function doProfessionCooldowns(
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
