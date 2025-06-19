import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import { DateTime } from 'luxon';

import { Constants } from '@/data/constants';
import { holidayIds, holidayMinimumLevel } from '@/data/holidays';
import { dragonflightProfessionMap, warWithinProfessionMap } from '@/data/professions';
import { professionCooldowns, professionWorkOrders } from '@/data/professions/cooldowns';
import { forcedReset, progressQuestMap } from '@/data/quests';
import { multiTaskMap, taskMap } from '@/data/tasks';
import { CharacterFlag } from '@/enums/character-flag';
import { Profession } from '@/enums/profession';
import { QuestStatus } from '@/enums/quest-status';
import { Region } from '@/enums/region';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { DbResetType } from '@/shared/stores/db/enums';
import { userState } from '@/user-home/state/user';
import { getNextDailyResetFromTime, getNextWeeklyResetFromTime } from '@/utils/get-next-reset';
import {
    type Character,
    type ProfessionCooldown,
    type ProfessionCooldownQuest,
    type ProfessionCooldownSpell,
} from '@/types';
import type { Settings } from '@/shared/stores/settings/types';
import type {
    TaskProfession,
    UserQuestData,
    UserQuestDataCharacterProgress,
    UserQuestDataCharacterProgressObjective,
} from '@/types/data';
import type { Chore } from '@/types/tasks';
import type { ActiveHolidays } from '../derived/active-holidays';

export interface LazyCharacter {
    chores: Record<string, LazyCharacterChore>;
    tasks: Record<string, LazyCharacterTask>;
    professionCooldowns: LazyCharacterCooldowns;
    professionWorkOrders: LazyCharacterCooldowns;
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
        public quest: UserQuestDataCharacterProgress
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

interface LazyStores {
    activeHolidays: ActiveHolidays;
    currentTime: DateTime;
    settings: Settings;
    userQuestData: UserQuestData;
}

let accountTasks: Record<string, LazyCharacterChoreTask> = {};
export function doCharacters(stores: LazyStores): Record<string, LazyCharacter> {
    console.time('doCharacters');

    accountTasks = {};
    const ret: Record<string, LazyCharacter> = {};

    for (const character of userState.general.characters) {
        const characterData = (ret[character.id] = {
            chores: {},
            tasks: {},
            professionCooldowns: doProfessionCooldowns(stores, character, professionCooldowns),
            professionWorkOrders: doProfessionCooldowns(
                stores,
                character,
                professionWorkOrders,
                CharacterFlag.IgnoreWorkOrders
            ),
        });

        doCharacterTasks(stores, character, characterData);
    }

    console.timeEnd('doCharacters');

    return ret;
}

function doCharacterTasks(stores: LazyStores, character: Character, characterData: LazyCharacter) {
    const customTaskMap = settingsState.customTaskMap;
    const charQuests = stores.userQuestData.characters[character?.id];
    const charScanned = charQuests?.scannedTime;

    const processTask = (choreTask: Chore, character: Character): LazyCharacterChoreTask => {
        const charTask = new LazyCharacterChoreTask(choreTask.taskKey, undefined);

        if (!character || !charQuests) {
            return charTask;
        }

        if (choreTask.questReset !== undefined) {
            const questIds = choreTask.questIdFunc?.(character, choreTask) || choreTask.questIds;
            for (const questId of questIds) {
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
                        expiresAt = getNextWeeklyResetFromTime(
                            charScanned,
                            character.realm?.region || Region.US
                        );
                    } else if (choreTask.questReset === DbResetType.Custom) {
                        expiresAt = choreTask.customExpiryFunc(character, charScanned);
                    } else {
                        expiresAt = getNextDailyResetFromTime(
                            charScanned,
                            character.realm?.region || Region.US
                        );
                    }

                    if (expiresAt > stores.currentTime) {
                        charTask.quest = {
                            expires: expiresAt.toUnixInteger(),
                            id: questId,
                            name:
                                wowthingData.static.questNameById.get(questId) ||
                                choreTask.taskName,
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
            (userState.general.characterById[character.id]?.getItemCount(235053) > 0 ||
                userState.general.characterById[character.id]?.getItemCount(236682) > 0)
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
        for (const fullTaskName of view.homeTasks) {
            const [taskName, choreName] = fullTaskName.split('|', 2);
            const task = taskMap[taskName] || customTaskMap[fullTaskName];
            if (
                !task ||
                character.ignored ||
                character.level < (task.minimumLevel || Constants.characterMaxLevel) ||
                character.level > (task.maximumLevel || Constants.characterMaxLevel)
            ) {
                continue;
            }

            const activeHoliday = stores.activeHolidays[taskName];
            if (
                activeHoliday &&
                holidayMinimumLevel[activeHoliday.id] &&
                character.level < holidayMinimumLevel[activeHoliday.id]
            ) {
                continue;
            }

            if (task.type === 'multi') {
                const charChore = new LazyCharacterChore();
                const disabledChores = view.disabledChores?.[fullTaskName] || [];

                // ugh
                for (const choreTask of multiTaskMap[taskName]) {
                    if (choreName && choreTask.taskKey !== choreName) {
                        continue;
                    }

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

                    // Any chore with required holidays needs at least one active
                    if (
                        choreTask.requiredHolidays?.length > 0 &&
                        !choreTask.requiredHolidays.some((holiday) =>
                            holidayIds[holiday].some(
                                (holidayId) => stores.activeHolidays[`h${holidayId}`]
                            )
                        )
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
                                        userState.general.characterById[parseInt(charId)]
                                    );
                                    return [charTask.status, charQuests.scannedAt, charTask];
                                }
                            ),
                            ([status, scannedAt]) => `${status}|${scannedAt}`
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
                            !charTask.quest ? choreTask.canGetFunc?.(character) || '' : ''
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
                        const professionId = wowthingData.static.professionBySlug.get(
                            nameParts[0].toLocaleLowerCase()
                        )?.id;
                        if (professionId) {
                            const professionData = choreTask.taskKey.startsWith('df')
                                ? dragonflightProfessionMap[professionId]
                                : warWithinProfessionMap[professionId];
                            const traitStats =
                                character.professions[professionId]?.subProfessionTraitStats?.[
                                    professionData.subProfessionId
                                ];
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
                                        (index + 1).toString()
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
                                /^\[\w+\] (Herbalism|Mining|Skinning):/
                            )
                                ? 6
                                : 4;
                            for (let dropIndex = 0; dropIndex < needCount; dropIndex++) {
                                const dropKey = choreTask.taskKey.replace(
                                    '#',
                                    (dropIndex + 1).toString()
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
                                    !firstChore.noProgress
                                );

                                if (firstChore.showQuestName) {
                                    if (firstQuest) {
                                        charTask.statusTexts = getObjectivesText(
                                            firstQuest.objectives
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
                                    (obj) => !!obj.text && obj.have >= obj.need
                                );
                            }
                        }
                    }

                    charChore.tasks.push(charTask);
                }

                if (charChore.tasks.length === 1 && charChore.tasks[0] !== null) {
                    const choreTask = multiTaskMap[taskName].find(
                        (chore) => chore.taskKey === charChore.tasks[0].key
                    );

                    // noAlone chores can't be the only one
                    if (choreTask.noAlone) {
                        continue;
                    }

                    charChore.status = charChore.tasks[0].status;

                    const objectives = charChore.tasks[0].quest?.objectives;
                    if (objectives?.length > 0) {
                        const objective = objectives[objectives.length - 1];
                        charChore.countCompleted = objective.have;
                        charChore.countTotal = objective.need;
                        charChore.countStarted = charChore.countTotal - charChore.countCompleted;
                    }
                } else {
                    const statuses = uniq(
                        charChore.tasks
                            .filter((task) => !!task && !task.skipped)
                            .map((task) => task.status)
                    );
                    if (statuses.length === 1) {
                        charChore.status = statuses[0];
                    }
                }

                characterData.chores[`${view.id}|${fullTaskName}`] = charChore;
            } else {
                // not multi
                const questKey = progressQuestMap[taskName] || taskName;

                const charTask: LazyCharacterTask = {
                    quest: undefined,
                    status: undefined,
                    text: undefined,
                };
                let progressQuest: UserQuestDataCharacterProgress;

                if (task.questReset !== undefined) {
                    for (const questId of task.questIds) {
                        // is the quest in progress?
                        const questProgress = charProgressQuests?.[`q${questId}`];
                        if (
                            questProgress &&
                            (!progressQuest || progressQuest.status < questProgress.status)
                        ) {
                            progressQuest = questProgress;
                        }

                        // is the quest completed?
                        if (stores.userQuestData.characters[character.id]?.quests?.has(questId)) {
                            let expiresAt: DateTime;
                            if (task.questReset === DbResetType.Weekly) {
                                expiresAt = getNextWeeklyResetFromTime(
                                    charScanned,
                                    character.realm?.region || Region.US
                                );
                            } else if (task.questReset === DbResetType.Daily) {
                                expiresAt = getNextDailyResetFromTime(
                                    charScanned,
                                    character.realm?.region || Region.US
                                );
                            }

                            if (expiresAt > stores.currentTime) {
                                charTask.quest = {
                                    expires: expiresAt.toUnixInteger(),
                                    id: questId,
                                    name:
                                        wowthingData.static.questNameById.get(questId) || task.name,
                                    objectives: [],
                                    status: QuestStatus.Completed,
                                };
                            }
                            break;
                        }
                    }
                }

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

                        const objectives = charTask.quest.objectives || [];
                        if (objectives.length === 1) {
                            const objective = charTask.quest.objectives[0];
                            if (objective.type === 'progressbar') {
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
                                    0
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
    useFlag: CharacterFlag = CharacterFlag.None
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
                        full = getNextDailyResetFromTime(
                            expires,
                            character.realm?.region || Region.US
                        );
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
                                character.professions?.[cooldownData.profession]?.subProfessions?.[
                                    tierSubProfessionId
                                ]?.traits?.[tierTraitId];
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
                            charNext + (charMax - charHave - 1) * seconds
                        );
                        const diff = Math.floor(
                            stores.currentTime.diff(DateTime.fromSeconds(charNext)).toMillis() /
                                1000
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
