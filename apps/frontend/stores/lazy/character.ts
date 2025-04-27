import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';

import { Constants } from '@/data/constants';
import { expansionOrder } from '@/data/expansion';
import { holidayMinimumLevel } from '@/data/holidays';
import {
    dragonflightProfessionMap,
    professionSlugToId,
    professionSpecializationSpells,
    warWithinProfessionMap,
} from '@/data/professions';
import { professionCooldowns, professionWorkOrders } from '@/data/professions/cooldowns';
import { forcedReset, progressQuestMap } from '@/data/quests';
import { multiTaskMap, taskMap } from '@/data/tasks';
import { CharacterFlag } from '@/enums/character-flag';
import { Faction } from '@/enums/faction';
import { Profession } from '@/enums/profession';
import { QuestStatus } from '@/enums/quest-status';
import { DbResetType } from '@/shared/stores/db/enums';
import { getActiveHolidays } from '@/utils/get-active-holidays';
import { getNextDailyResetFromTime, getNextWeeklyResetFromTime } from '@/utils/get-next-reset';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
import {
    UserCount,
    type Character,
    type ProfessionCooldown,
    type ProfessionCooldownQuest,
    type ProfessionCooldownSpell,
    type UserData,
} from '@/types';
import type { Settings } from '@/shared/stores/settings/types';
import type {
    StaticData,
    StaticDataProfessionAbility,
    StaticDataProfessionCategory,
    StaticDataSubProfessionTraitNode,
} from '@/shared/stores/static/types';
import type {
    TaskProfession,
    UserQuestData,
    UserQuestDataCharacterProgress,
    UserQuestDataCharacterProgressObjective,
} from '@/types/data';
import type { Chore } from '@/types/tasks';

export interface LazyCharacter {
    chores: Record<string, LazyCharacterChore>;
    tasks: Record<string, LazyCharacterTask>;
    professionCooldowns: LazyCharacterCooldowns;
    professionWorkOrders: LazyCharacterCooldowns;
    professions: LazyCharacterProfessions;
}
export class LazyCharacterChore {
    anyReady = false;
    countCompleted = 0;
    countStarted = 0;
    countTotal = 0;
    name: string;
    status = QuestStatus.NotStarted;
    tasks: LazyCharacterChoreTask[] = [];
}
export class LazyCharacterChoreTask {
    name: string;
    skipped = false;
    status: QuestStatus = QuestStatus.NotStarted;
    statusTexts: string[] = [];

    constructor(
        public key: string,
        public quest: UserQuestDataCharacterProgress,
    ) {}
}
export interface LazyCharacterTask {
    quest: UserQuestDataCharacterProgress;
    status: string;
    text: string;
}
export class LazyCharacterCooldowns {
    anyFull = false;
    anyHalf = false;
    have = 0;
    total = 0;
    cooldowns: ProfessionCooldown[] = [];
}
export class LazyCharacterProfessions {
    knownRecipes: Set<number> = new Set<number>();
    professions: Record<number, LazyCharacterProfession> = {};
}
export class LazyCharacterProfession {
    filteredCategories: Record<number, StaticDataProfessionAbility[]> = {};
    stats: UserCount = new UserCount();
    subProfessions: Record<number, LazyCharacterSubProfession> = {};

    constructor(public professionId: number) {}
}

export class LazyCharacterSubProfession {
    stats: UserCount = new UserCount();
    traitStats?: UserCount;
}

interface LazyStores {
    currentTime: DateTime;
    settings: Settings;
    staticData: StaticData;
    userData: UserData;
    userQuestData: UserQuestData;
}

let accountTasks: Record<string, LazyCharacterChoreTask> = {};
export function doCharacters(stores: LazyStores): Record<string, LazyCharacter> {
    console.time('doCharacters');

    accountTasks = {};
    const ret: Record<string, LazyCharacter> = {};

    for (const character of stores.userData.characters) {
        const characterData = (ret[character.id] = {
            chores: {},
            tasks: {},
            professionCooldowns: doProfessionCooldowns(stores, character, professionCooldowns),
            professionWorkOrders: doProfessionCooldowns(
                stores,
                character,
                professionWorkOrders,
                CharacterFlag.IgnoreWorkOrders,
            ),
            professions: new LazyCharacterProfessions(),
        });

        const professions = new ProcessCharacterProfessions(
            stores,
            character,
            characterData.professions,
        );
        professions.process();

        doCharacterTasks(stores, character, characterData);
    }

    console.timeEnd('doCharacters');

    return ret;
}

class ProcessCharacterProfessions {
    private currentProfession: LazyCharacterProfession;
    private currentSubProfession: LazyCharacterSubProfession;

    constructor(
        private stores: LazyStores,
        private character: Character,
        private characterData: LazyCharacterProfessions,
    ) {}

    public process() {
        for (const [professionId, characterSubProfessions] of getNumberKeyedEntries(
            this.character.professions || {},
        )) {
            const staticProfession = this.stores.staticData.professions[professionId];
            // if (staticProfession.type !== 0) {
            //     continue;
            // }

            for (const subProfession of Object.values(characterSubProfessions)) {
                for (const abilityId of subProfession.knownRecipes || []) {
                    this.characterData.knownRecipes.add(abilityId);
                }
            }

            this.currentProfession = this.characterData.professions[professionId] =
                new LazyCharacterProfession(professionId);

            for (const expansion of expansionOrder) {
                const subProfession = staticProfession.expansionSubProfession[expansion.id];
                if (!subProfession) {
                    continue;
                }

                // const characterSubProfession = characterSubProfessions[subProfession.id]
                // if (!characterSubProfession) { continue }

                this.currentSubProfession = this.currentProfession.subProfessions[
                    subProfession.id
                ] = new LazyCharacterSubProfession();

                let rootCategory = staticProfession.expansionCategory?.[expansion.id];
                if (rootCategory) {
                    while (rootCategory.children.length === 1) {
                        rootCategory = rootCategory.children[0];
                    }
                }

                this.recurseCategory(rootCategory);

                if (subProfession.traitTrees) {
                    this.currentSubProfession.traitStats = new UserCount();

                    const charTraits = this.character.professionTraits?.[subProfession.id] || {};
                    for (const traitTree of subProfession.traitTrees) {
                        this.recurseTraits(charTraits, traitTree.firstNode);
                    }
                }
            }
        }
    }

    private recurseCategory(category: StaticDataProfessionCategory) {
        const filteredCategory: StaticDataProfessionAbility[] =
            (this.currentProfession.filteredCategories[category.id] = []);

        for (const ability of category.abilities || []) {
            if (ability.faction !== Faction.Neutral && ability.faction !== this.character.faction) {
                continue;
            }

            const requiredAbility =
                this.stores.staticData.itemToRequiredAbility[ability.itemIds[0]];
            if (professionSpecializationSpells[requiredAbility]) {
                const charSpecialization =
                    this.character.professionSpecializations[this.currentProfession.professionId];
                if (charSpecialization !== undefined && charSpecialization !== requiredAbility) {
                    continue;
                }
            }

            filteredCategory.push(ability);

            if (ability.extraRanks) {
                this.currentProfession.stats.total += ability.extraRanks.length + 1;
                this.currentSubProfession.stats.total += ability.extraRanks.length + 1;

                for (let rankIndex = ability.extraRanks.length - 1; rankIndex >= 0; rankIndex--) {
                    if (this.characterData.knownRecipes.has(ability.extraRanks[rankIndex][0])) {
                        this.currentProfession.stats.have += rankIndex + 2;
                        this.currentSubProfession.stats.have += rankIndex + 2;
                        break;
                    }
                }
                if (this.characterData.knownRecipes.has(ability.id)) {
                    this.currentProfession.stats.have++;
                    this.currentSubProfession.stats.have++;
                }
            } else {
                this.currentProfession.stats.total++;
                this.currentSubProfession.stats.total++;

                if (this.characterData.knownRecipes.has(ability.id)) {
                    this.currentProfession.stats.have++;
                    this.currentSubProfession.stats.have++;
                }
            }
        }

        for (const child of category.children || []) {
            this.recurseCategory(child);
        }
    }

    private recurseTraits(
        charTraits: Record<number, number>,
        node: StaticDataSubProfessionTraitNode,
    ) {
        this.currentSubProfession.traitStats.have += (charTraits[node.nodeId] || 1) - 1;
        this.currentSubProfession.traitStats.total += node.rankMax;

        for (const childNode of node.children || []) {
            this.recurseTraits(charTraits, childNode);
        }
    }
}

function doCharacterTasks(stores: LazyStores, character: Character, characterData: LazyCharacter) {
    const processTask = (choreTask: Chore, character: Character): LazyCharacterChoreTask => {
        let charTask = new LazyCharacterChoreTask(choreTask.taskKey, undefined);
        if (!character) {
            return charTask;
        }

        const charQuests = stores.userQuestData.characters[character.id];
        const charScanned = charQuests.scannedTime;

        if (choreTask.questIds) {
            for (const questId of choreTask.questIds) {
                // is the quest in progress?
                const questProgress = charProgressQuests?.[`q${questId}`];
                if (questProgress) {
                    charTask.quest = questProgress;
                    charTask.status = questProgress.status;

                    if (
                        questProgress.status === QuestStatus.InProgress &&
                        questProgress.objectives?.length > 0
                    ) {
                        charTask.statusTexts = getObjectivesText(questProgress.objectives);
                    }

                    if (choreTask.questReset === DbResetType.Custom) {
                        charTask.quest.expires = choreTask
                            .customExpiryFunc(character, charScanned)
                            .toUnixInteger();
                    }

                    break;
                }

                // is the quest completed?
                if (stores.userQuestData.characters[character.id]?.quests?.has(questId)) {
                    let expiresAt: DateTime;
                    if (choreTask.questReset === DbResetType.Weekly) {
                        expiresAt = getNextWeeklyResetFromTime(charScanned, character.realm.region);
                    } else if (choreTask.questReset === DbResetType.Custom) {
                        expiresAt = choreTask.customExpiryFunc(character, charScanned);
                    } else {
                        expiresAt = getNextDailyResetFromTime(charScanned, character.realm.region);
                    }

                    if (expiresAt > stores.currentTime) {
                        charTask.quest = {
                            expires: expiresAt.toUnixInteger(),
                            id: questId,
                            name: stores.staticData.questNames[questId] || choreTask.taskName,
                            objectives: [],
                            status: QuestStatus.Completed,
                        };
                    }
                    break;
                }
            }
        } else {
            charTask.quest = charQuests?.progressQuests?.[choreTask.taskKey];
            if (charTask.quest) {
                charTask.status = charTask.quest.status;
            }
        }

        if (
            choreTask.taskKey === 'twwChettList' &&
            charTask.status === 0 &&
            (stores.userData.characterMap[character.id]?.getItemCount(235053) > 0 ||
                stores.userData.characterMap[character.id]?.getItemCount(236682) > 0)
        ) {
            charTask.status = 1;
        }

        return charTask;
    };

    const charProgressQuests = stores.userQuestData.characters[character.id]?.progressQuests;
    if (charProgressQuests && !charProgressQuests['twwDelveGilded']) {
        const have = character.weekly?.delveGilded || 0;
        charProgressQuests['twwDelveGilded'] = {
            id: 0,
            status: have === 3 ? QuestStatus.Completed : QuestStatus.InProgress,
            expires: 0,
            name: `${have}/3 Gilded Stash`,
            objectives: [
                {
                    type: 'bar',
                    have: 0,
                    need: 3,
                    text: `${have}/3 Gilded Stash`,
                },
            ],
        } as UserQuestDataCharacterProgress;
    }

    for (const view of stores.settings.views) {
        const activeHolidays = getActiveHolidays(stores.currentTime, view, character.realm.region);

        for (const taskName of view.homeTasks) {
            const task = taskMap[taskName];
            if (
                !task ||
                character.ignored ||
                character.level < (task.minimumLevel || Constants.characterMaxLevel) ||
                character.level > (task.maximumLevel || Constants.characterMaxLevel)
            ) {
                continue;
            }

            const activeHoliday = activeHolidays[taskName];
            if (
                activeHoliday &&
                holidayMinimumLevel[activeHoliday.id] &&
                character.level < holidayMinimumLevel[activeHoliday.id]
            ) {
                continue;
            }

            if (task.type === 'multi') {
                const charChore = new LazyCharacterChore();
                const disabledChores = view.disabledChores?.[taskName] || [];

                // ugh
                for (const choreTask of multiTaskMap[taskName]) {
                    if (!choreTask) {
                        charChore.tasks.push(null);
                        continue;
                    }

                    if (
                        character.level <
                            (choreTask.minimumLevel ||
                                task.minimumLevel ||
                                Constants.characterMaxLevel) ||
                        character.level >
                            (choreTask.maximumLevel ||
                                task.maximumLevel ||
                                Constants.characterMaxLevel) ||
                        choreTask.couldGetFunc?.(character, choreTask) === false
                    ) {
                        continue;
                    }

                    if (choreTask.taskKey.endsWith('Split')) {
                        choreTask.taskKey = choreTask.taskKey.slice(0, -5);
                    }

                    let charTask: LazyCharacterChoreTask;
                    if (choreTask.accountWide) {
                        charTask = accountTasks[choreTask.taskKey] ||= sortBy(
                            Object.entries(stores.userQuestData.characters).map(
                                ([charId, charQuests]) => {
                                    const charTask = processTask(
                                        choreTask,
                                        stores.userData.characterMap[parseInt(charId)],
                                    );
                                    return [charTask.status, charQuests.scannedAt, charTask];
                                },
                            ),
                            ([status, scannedAt]) => `${status}|${scannedAt}`,
                        ).at(-1)?.[2] as LazyCharacterChoreTask;
                    } else {
                        charTask = processTask(choreTask, character);
                    }

                    if (
                        disabledChores.indexOf(choreTask.taskKey) >= 0 &&
                        (!view.showCompletedUntrackedChores ||
                            charTask.quest?.status !== QuestStatus.Completed)
                    ) {
                        continue;
                    }

                    if (
                        !charTask.quest &&
                        choreTask.taskKey.endsWith('Treatise') &&
                        !stores.settings.professions.dragonflightTreatises
                    ) {
                        continue;
                    }

                    if (charTask.statusTexts.length === 0) {
                        charTask.statusTexts.push(
                            !charTask.quest ? choreTask.canGetFunc?.(character) || '' : '',
                        );
                    }

                    const nameParts = choreTask.taskName.split(': ');
                    if (['Cooking', 'Fishing'].indexOf(nameParts[0]) >= 0) {
                        continue;
                    }

                    let skipTraits = false;
                    if (
                        stores.settings.professions.ignoreTasksWhenDoneWithTraits &&
                        choreTask.taskKey.match(/^[a-z]+Profession/)
                    ) {
                        const professionId = professionSlugToId[nameParts[0].toLocaleLowerCase()];
                        if (professionId) {
                            const professionData = choreTask.taskKey.startsWith('df')
                                ? dragonflightProfessionMap[professionId]
                                : warWithinProfessionMap[professionId];
                            const traitStats =
                                characterData.professions.professions[professionId]?.subProfessions[
                                    professionData.subProfessionId
                                ]?.traitStats;
                            if (traitStats && traitStats.percent === 100) {
                                skipTraits = true;
                            }
                        }
                    }

                    const isGathering =
                        ['Herbalism', 'Mining', 'Skinning'].indexOf(nameParts[0]) >= 0;
                    charTask.skipped =
                        charTask.status !== QuestStatus.Completed &&
                        ((!stores.settings.professions.dragonflightCountCraftingDrops &&
                            nameParts[1] === 'Drops') ||
                            (!stores.settings.professions.dragonflightCountTasks &&
                                nameParts[1] === 'Task') ||
                            (!stores.settings.professions.dragonflightCountGathering &&
                                isGathering &&
                                ['Gather'].indexOf(nameParts[1]) >= 0) ||
                            // charTask.statusTexts[0] !== '' ||
                            skipTraits);

                    if (!charTask.skipped) {
                        charChore.countTotal++;
                    }

                    if (charTask.statusTexts[0].startsWith('Need')) {
                        charTask.status = QuestStatus.Error;
                    } else if (choreTask.taskKey.endsWith('Drop#')) {
                        charTask.statusTexts = [];
                        let haveCount = 0;
                        let needCount = 0;

                        if (taskName.endsWith('ProfessionWeeklies')) {
                            const professionName = choreTask.taskKey
                                .replace(/^\w+Profession/, '')
                                .replace('Drop#', '');
                            const profession =
                                Profession[professionName as keyof typeof Profession];
                            const professionData: TaskProfession = taskName.startsWith('df')
                                ? dragonflightProfessionMap[profession]
                                : warWithinProfessionMap[profession];

                            if (professionData.dropQuests?.length > 0) {
                                needCount = professionData.dropQuests.length;

                                professionData.dropQuests.forEach((drop, index) => {
                                    const dropKey = choreTask.taskKey.replace(
                                        '#',
                                        (index + 1).toString(),
                                    );
                                    const progressQuest =
                                        stores.userQuestData.characters[character.id]
                                            ?.progressQuests?.[dropKey];

                                    let statusText = '';
                                    if (
                                        progressQuest?.status === QuestStatus.Completed &&
                                        DateTime.fromSeconds(progressQuest.expires) >
                                            stores.currentTime
                                    ) {
                                        haveCount++;
                                        statusText +=
                                            '<span class="status-success">:starFull:</span>';
                                    } else {
                                        statusText +=
                                            '<span class="status-fail">:starEmpty:</span>';
                                    }

                                    statusText += `{item:${drop.itemId}}`;
                                    statusText += ` <span class="status-shrug">(${drop.source})</span>`;

                                    charTask.statusTexts.push(statusText);
                                });
                            }
                        }

                        if (charTask.statusTexts.length === 0) {
                            needCount = choreTask.taskName.match(
                                /^\[\w+\] (Herbalism|Mining|Skinning):/,
                            )
                                ? 6
                                : 4;
                            for (let dropIndex = 0; dropIndex < needCount; dropIndex++) {
                                const dropKey = choreTask.taskKey.replace(
                                    '#',
                                    (dropIndex + 1).toString(),
                                );
                                const progressQuest =
                                    stores.userQuestData.characters[character.id]?.progressQuests?.[
                                        dropKey
                                    ];
                                if (
                                    progressQuest?.status === QuestStatus.Completed &&
                                    DateTime.fromSeconds(progressQuest.expires) > stores.currentTime
                                ) {
                                    haveCount++;
                                }
                            }
                        }

                        if (haveCount === needCount) {
                            charTask.status = QuestStatus.Completed;
                        } else {
                            charTask.status = QuestStatus.InProgress;
                            if (charTask.statusTexts.length === 0) {
                                charTask.statusTexts.push(`${haveCount}/${needCount} Collected`);
                            }
                        }
                    } else {
                        if (
                            !!charTask.quest &&
                            (DateTime.fromSeconds(charTask.quest.expires) > stores.currentTime ||
                                (choreTask.taskKey.startsWith('dmf') &&
                                    charTask.quest.expires === 0))
                        ) {
                            charTask.status = charTask.quest.status;
                            if (
                                charTask.status === QuestStatus.InProgress &&
                                charTask.quest.objectives?.length > 0
                            ) {
                                charTask.statusTexts = getObjectivesText(charTask.quest.objectives);
                            }
                        } else if (choreTask.subChores?.length > 0) {
                            let firstChore: Chore = undefined;
                            let firstQuest: UserQuestDataCharacterProgress = undefined;

                            let subCompleted = 0;
                            let subTotal = 0;
                            for (const subChore of choreTask.subChores) {
                                subTotal++;

                                const subQuest =
                                    stores.userQuestData.characters[character.id]?.progressQuests?.[
                                        subChore.taskKey
                                    ];
                                if (subQuest?.status === QuestStatus.Completed) {
                                    subCompleted++;
                                } else {
                                    firstChore ||= subChore;
                                    firstQuest ||= subQuest;
                                }
                            }

                            charTask.quest = <UserQuestDataCharacterProgress>{
                                id: 0,
                                name: [
                                    `[${subCompleted}/${subTotal}]`,
                                    ...(firstChore ? [firstChore.taskName] : []),
                                    choreTask.taskName,
                                ].join(' '),
                                status:
                                    subCompleted === 0
                                        ? QuestStatus.NotStarted
                                        : subCompleted < subTotal
                                          ? QuestStatus.InProgress
                                          : QuestStatus.Completed,
                            };
                            charTask.status = charTask.quest.status;

                            if (charTask.status === QuestStatus.InProgress) {
                                let otherText = firstChore.taskName;
                                const starHtml = getStarHtml(
                                    false,
                                    firstChore.noProgress || !!firstQuest,
                                    !firstChore.noProgress,
                                );

                                if (firstChore.showQuestName) {
                                    if (firstQuest) {
                                        charTask.statusTexts = getObjectivesText(
                                            firstQuest.objectives,
                                        );
                                    } else {
                                        otherText = 'Get quest!';
                                    }
                                }

                                if (charTask.statusTexts[0] === '') {
                                    charTask.statusTexts = [`${starHtml} ${otherText}`];
                                }
                            }
                        } else if (
                            choreTask.noProgress &&
                            charTask.status === QuestStatus.NotStarted
                        ) {
                            charTask.status = QuestStatus.InProgress;
                        }
                    }

                    charTask.name =
                        choreTask.showQuestName || choreTask.subChores?.length > 0
                            ? charTask.quest?.name || choreTask.taskName
                            : choreTask.taskName;

                    if (!charTask.skipped) {
                        if (charTask.status === QuestStatus.Completed) {
                            charChore.countCompleted++;
                        } else if (charTask.status === QuestStatus.InProgress) {
                            charChore.countStarted++;
                            if (
                                charTask.status === QuestStatus.InProgress &&
                                charTask.quest?.objectives?.length > 0
                            ) {
                                charChore.anyReady ||= charTask.quest.objectives.every(
                                    (obj) => !!obj.text && obj.have >= obj.need,
                                );
                            }
                        }
                    }

                    charChore.tasks.push(charTask);
                }

                characterData.chores[`${view.id}|${taskName}`] = charChore;
            } else {
                // not multi
                const questKey = progressQuestMap[taskName] || taskName;
                const charTask: LazyCharacterTask = {
                    quest: stores.userQuestData.characters[character.id]?.progressQuests?.[
                        questKey
                    ],
                    status: undefined,
                    text: undefined,
                };

                if (charTask.quest) {
                    const expires = DateTime.fromSeconds(charTask.quest.expires);
                    if (forcedReset[questKey]) {
                        // quest always resets even if incomplete
                        if (expires < stores.currentTime) {
                            charTask.quest.status = QuestStatus.NotStarted;
                        }
                    } else {
                        // quest was completed and it's a new week
                        if (
                            charTask.quest.status === QuestStatus.Completed &&
                            expires < stores.currentTime
                        ) {
                            charTask.quest.status = QuestStatus.NotStarted;
                        }
                    }

                    if (charTask.quest.status === QuestStatus.Completed) {
                        charTask.status = 'success';
                        charTask.text = 'Done';
                    } else if (charTask.quest.status === QuestStatus.InProgress) {
                        charTask.status = 'shrug';

                        let objectives = charTask.quest.objectives || [];
                        if (objectives.length === 1) {
                            const objective = charTask.quest.objectives[0];
                            if (objective.type === 'progressbar') {
                                charTask.text = `${objective.have} %`;
                            } else if (questKey === 'weeklyHoliday' || questKey === 'weeklyPvp') {
                                charTask.text = `${objective.have} / ${objective.need}`;
                            } else {
                                charTask.text = `${Math.floor((Math.min(objective.have, objective.need) / objective.need) * 100)} %`;
                            }

                            if (objective.have === objective.need) {
                                charTask.status = `${charTask.status} status-turn-in`;
                            }
                        } else {
                            const averagePercent =
                                objectives.reduce(
                                    (a, b) => a + Math.min(b.have, b.need) / b.need,
                                    0,
                                ) / objectives.length;

                            charTask.text = `${Math.floor(averagePercent * 100)} %`;

                            if (averagePercent >= 1) {
                                charTask.status = `${charTask.status} status-turn-in`;
                            }
                        }
                    }
                }

                if (charTask.status === undefined) {
                    charTask.status = 'fail';
                    charTask.text = 'Get!';
                }

                characterData.tasks[`${view.id}|${taskName}`] = charTask;
            }
        } // choreTask of choreTasks
    } // view of views
}

function doProfessionCooldowns(
    stores: LazyStores,
    character: Character,
    cooldownDatas: (ProfessionCooldownQuest | ProfessionCooldownSpell)[],
    useFlag: CharacterFlag = CharacterFlag.None,
): LazyCharacterCooldowns {
    const ret = new LazyCharacterCooldowns();

    const flags = stores.settings.characters.flags[character.id] || 0;
    if ((flags & useFlag) === 0) {
        for (const cooldownData of cooldownDatas) {
            if (
                stores.settings.professions.cooldowns[cooldownData.key] === false ||
                !character.professions?.[cooldownData.profession]
            ) {
                continue;
            }

            if (cooldownData.type === 'quest') {
                if (!cooldownData.minimumLevel || character.level < cooldownData.minimumLevel) {
                    continue;
                }

                const progressQuest =
                    stores.userQuestData.characters[character.id]?.progressQuests?.[
                        cooldownData.key
                    ];
                let full: DateTime = undefined;
                let have = 1;
                if (progressQuest) {
                    const expires = DateTime.fromSeconds(progressQuest.expires, { zone: 'utc' });
                    if (expires > stores.currentTime) {
                        full = getNextDailyResetFromTime(expires, character.realm.region);
                        have = 0;
                    }
                }

                ret.have += have;
                ret.total++;
                if (have) {
                    ret.anyFull = true;
                }

                ret.cooldowns.push({
                    data: cooldownData,
                    have,
                    max: 1,
                    full,
                    seconds: 86400,
                });
            } else if (cooldownData.type === 'spell') {
                const charCooldown = character.professionCooldowns?.[cooldownData.key];
                if (charCooldown) {
                    let seconds = 0;
                    for (const [
                        tierSeconds,
                        tierSubProfessionId,
                        tierTraitId,
                        tierMinimum,
                    ] of cooldownData.cooldown) {
                        if (seconds === 0) {
                            seconds = tierSeconds;
                        } else {
                            const charTrait =
                                character.professionTraits?.[tierSubProfessionId]?.[tierTraitId];
                            if (charTrait && charTrait >= tierMinimum) {
                                seconds = tierSeconds;
                            }
                        }
                    }

                    const [charNext, , charMax] = charCooldown;
                    let [, charHave] = charCooldown;
                    let charFull: DateTime = undefined;

                    // if the next charge timestamp is in the past, add up to max charges and work
                    // out when this character will be full
                    if (charNext > 0) {
                        charFull = DateTime.fromSeconds(
                            charNext + (charMax - charHave - 1) * seconds,
                        );
                        const diff = Math.floor(
                            stores.currentTime.diff(DateTime.fromSeconds(charNext)).toMillis() /
                                1000,
                        );
                        if (diff > 0) {
                            charHave = Math.min(charMax, charHave + 1 + Math.floor(diff / seconds));
                        }
                    }

                    ret.have += charHave;
                    ret.total += charMax;

                    const per = (charHave / charMax) * 100;
                    if (per === 100 && !cooldownData.unimportant) {
                        ret.anyFull = true;
                    } else if (per >= 50) {
                        ret.anyHalf = true;
                    }

                    ret.cooldowns.push({
                        data: cooldownData,
                        have: charHave,
                        max: charMax,
                        full: charFull,
                        seconds,
                    });
                } /*else {
                    ret.have += 1;
                    ret.total += 1;

                    ret.cooldowns.push({
                        data: cooldownData,
                        have: -1,
                        max: -1,
                        full: undefined,
                        seconds: -1,
                    });
                }*/
            }
        }
    }

    return ret;
}

function getObjectivesText(objectives: UserQuestDataCharacterProgressObjective[]): string[] {
    const texts: string[] = [];

    for (const objective of objectives) {
        if (objective.text === '') {
            continue;
        }
        if (
            objective.have === objective.need &&
            (objective.text.includes('"Enter the Dream"') ||
                objective.text.includes('contract for the week'))
        ) {
            continue;
        }
        if (objective.have === 0 && objective.text.endsWith('(Optional)')) {
            continue;
        }

        let statusText = '';
        if (objective.have === objective.need) {
            statusText += '<span class="status-success">:starFull:</span>';
        } else {
            statusText += '<span class="status-shrug">:starHalf:</span>';
        }
        statusText += ` ${objective.text}`;

        texts.push(statusText);
    }

    return texts;
}

function getStarHtml(fullState = false, halfState = false, emptyState = false): string {
    if (fullState) {
        return '<span class="status-success">:starFull:</span>';
    } else if (halfState) {
        return '<span class="status-shrug">:starHalf:</span>';
    } else if (emptyState) {
        return '<span class="status-fail">:starEmpty:</span>';
    }

    return 'ERROR';
}
