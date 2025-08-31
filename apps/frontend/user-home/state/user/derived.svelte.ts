import uniq from 'lodash/uniq';
import { DateTime } from 'luxon';

import { Constants } from '@/data/constants';
import { expansionMap, expansionOrder } from '@/data/expansion';
import { holidayIds, holidayMinimumLevel } from '@/data/holidays';
import { dragonflightProfessionMap, warWithinProfessionMap } from '@/data/professions';
import { forcedReset, progressQuestMap } from '@/data/quests';
import { multiTaskMap, taskMap } from '@/data/tasks';
import { Profession } from '@/enums/profession';
import { QuestStatus } from '@/enums/quest-status';
import { Region } from '@/enums/region';
import { browserState, type CollectibleState } from '@/shared/state/browser.svelte';
import { settingsState } from '@/shared/state/settings.svelte';
import { timeState } from '@/shared/state/time.svelte';
import { wowthingData } from '@/shared/stores/data';
import { DbResetType } from '@/shared/stores/db/enums';
import { Character, UserCount } from '@/types';
import {
    ManualDataSetCategory,
    ManualDataSetGroup,
    type ManualDataSetGroupArray,
} from '@/types/data/manual';
import { getNextDailyResetFromTime, getNextWeeklyResetFromTime } from '@/utils/get-next-reset';
import type {
    TaskProfession,
    UserQuestDataCharacterProgress,
    UserQuestDataCharacterProgressObjective,
} from '@/types/data';
import type { Chore } from '@/types/tasks';

import { activeHolidays } from '../activeHolidays.svelte';
import type { CharacterQuests } from './types';
import { CharacterChore, CharacterChoreTask, type CharacterTask } from './types/tasks.svelte';

interface UserCollectible {
    filteredCategories: ManualDataSetCategory[][];
    stats: Record<string, UserCount>;
}
class UserRecipes {
    public abilitySpells: Record<number, number[]> = {};
    public hasAbility: Record<number, boolean[]> = {};
    public stats: Record<string, UserCount> = {};
}

export class DataUserDerived {
    public doCollectible(
        collectionKey: string,
        categories: ManualDataSetCategory[][],
        userHasFunc: (id: number) => boolean
    ): UserCollectible {
        // console.time(`doCollectible(${collectionKey})`)

        const ret: UserCollectible = {
            filteredCategories: categories,
            stats: {},
        };

        const hideUnavailable = settingsState.value.collections.hideUnavailable;

        const collectibleState = browserState.current[
            `collectible-${collectionKey}` as keyof typeof browserState.current
        ] as CollectibleState;
        const showCollected = collectibleState.showCollected;
        const showUncollected = collectibleState.showUncollected;

        // Stats
        const overallData = (ret.stats['OVERALL'] = new UserCount());
        const overallSeen: Record<number, boolean> = {};

        for (const category of categories) {
            if (category === null) {
                continue;
            }

            const categoryData = (ret.stats[category[0].slug] = new UserCount());
            const categoryUnavailable = category[0].slug === 'unavailable';

            for (const set of category) {
                const setData = (ret.stats[`${category[0].slug}--${set.slug}`] = new UserCount());
                const setUnavailable = set.slug === 'unavailable';
                const setSeen = new Set<number>();

                for (const group of set.groups) {
                    const groupData = (ret.stats[
                        `${category[0].slug}--${set.slug}--${group.name}`
                    ] = new UserCount());
                    const groupUnavailable = group.name.indexOf('Unavailable') >= 0;

                    for (const things of group.things) {
                        const hasThing = things.some((t) => userHasFunc(t));
                        const seenOverall = things.some((t) => overallSeen[t]);
                        const seenSet = things.some((t) => setSeen.has(t));

                        const doOverall =
                            !seenOverall &&
                            (hasThing ||
                                (!categoryUnavailable && !setUnavailable && !groupUnavailable));
                        const doCategory =
                            hasThing ||
                            (!setUnavailable &&
                                !groupUnavailable &&
                                (!hideUnavailable || !categoryUnavailable));
                        const doSet =
                            hasThing ||
                            !hideUnavailable ||
                            (!groupUnavailable && !setUnavailable && !categoryUnavailable);

                        if (doOverall) {
                            overallData.total++;
                        }
                        if (doCategory) {
                            categoryData.total++;
                        }
                        if (doSet) {
                            if (!seenSet) {
                                setData.total++;
                            }
                            groupData.total++;
                        }

                        if (hasThing) {
                            if (doOverall) {
                                overallData.have++;
                            }
                            if (doCategory) {
                                categoryData.have++;
                            }
                            if (doSet) {
                                if (!seenSet) {
                                    setData.have++;
                                }
                                groupData.have++;
                            }
                        }

                        for (const thing of things) {
                            overallSeen[thing] = true;
                            setSeen.add(thing);
                        }
                    }
                }
            }
        }

        // Filtered categories
        if (hideUnavailable || !showCollected || !showUncollected) {
            ret.filteredCategories = [];
            for (const category of categories) {
                if (category === null) {
                    ret.filteredCategories.push(null);
                    continue;
                }

                const categoryUnavailable = category[0].slug === 'unavailable';

                const newCategory: ManualDataSetCategory[] = [];
                for (const set of category) {
                    const setUnavailable = set.slug === 'unavailable';
                    const newGroups: ManualDataSetGroup[] = [];
                    for (const group of set.groups) {
                        const groupUnavailable = group.name.indexOf('Unavailable') >= 0;
                        const newThings: number[][] = group.things.filter((thing) => {
                            const hasThing = thing.some((thingId) => userHasFunc(thingId));

                            if (
                                hideUnavailable &&
                                (categoryUnavailable || setUnavailable || groupUnavailable) &&
                                !hasThing
                            ) {
                                return false;
                            }

                            return (showCollected && hasThing) || (showUncollected && !hasThing);
                        });

                        if (newThings.length > 0) {
                            newGroups.push(new ManualDataSetGroup(group.name, newThings));
                        }
                    }

                    const newGroupArrays: ManualDataSetGroupArray[] = newGroups.map((group) => [
                        group.name,
                        group.things,
                    ]);
                    newCategory.push(new ManualDataSetCategory(set.name, set.slug, newGroupArrays));
                }

                ret.filteredCategories.push(newCategory);
            }
        }

        // console.timeEnd(`doCollectible(${collectionKey})`)

        return ret;
    }

    public doRecipes(allCharacters: Character[]) {
        console.time('doRecipes');

        const ret = new UserRecipes();

        const overallData = (ret.stats['OVERALL'] = new UserCount());

        for (const profession of wowthingData.static.professionById.values()) {
            const professionKey = profession.slug;
            const professionData = (ret.stats[professionKey] = new UserCount());

            const allKnown = new Set<number>();
            const collectorIds =
                settingsState.value.professions.collectingCharactersV2?.[profession.id];
            const characters =
                collectorIds?.length > 0
                    ? collectorIds.map((collectorId) =>
                          allCharacters.find((c) => c.id === collectorId)
                      )
                    : allCharacters;
            for (const character of characters || []) {
                for (const recipeId of character?.professions?.[profession.id]?.knownRecipes ||
                    []) {
                    allKnown.add(recipeId);
                }
            }

            const categories = profession.categories || [];
            for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
                const category = categories[categoryIndex];
                if (!category.children[0]?.children) {
                    continue;
                }

                if (categoryIndex >= expansionOrder.length) {
                    console.warn(
                        'Uhhhh this profession category has no expansion?',
                        profession,
                        categoryIndex
                    );
                    continue;
                }

                const expansionSlug = expansionMap[categoryIndex].slug;

                const categoryKey = `${professionKey}--${expansionSlug}`;
                const categoryData = (ret.stats[categoryKey] = new UserCount());

                const expansionKey = `expansion--${expansionSlug}`;
                const expansionData = (ret.stats[expansionKey] ||= new UserCount());

                for (const child of category.children[0].children) {
                    const childKey = `${categoryKey}--${child.id}`;
                    const childData = (ret.stats[childKey] = new UserCount());

                    for (const ability of child.abilities) {
                        const abilityIds = [
                            ability.id,
                            ...(ability.extraRanks || []).map(([abilityId]) => abilityId),
                        ];
                        ret.abilitySpells[ability.id] = [
                            ability.spellId,
                            ...(ability.extraRanks || []).map(([, spellId]) => spellId),
                        ];
                        // a multi-rank ability is collected if you know that specific rank OR
                        // any higher rank
                        ret.hasAbility[ability.id] = abilityIds.map((_, index) =>
                            abilityIds.slice(index).some((abilityId) => allKnown.has(abilityId))
                        );

                        const abilityCount = abilityIds.length;
                        const abilityHave = ret.hasAbility[ability.id].filter(
                            (have) => have
                        ).length;

                        if (
                            !settingsState.value.collections.hideFuture ||
                            categoryIndex <= Constants.expansion
                        ) {
                            overallData.total += abilityCount;
                            overallData.have += abilityHave;

                            professionData.total += abilityCount;
                            professionData.have += abilityHave;
                        }

                        expansionData.total += abilityCount;
                        expansionData.have += abilityHave;

                        categoryData.total += abilityCount;
                        categoryData.have += abilityHave;

                        childData.total += abilityCount;
                        childData.have += abilityHave;
                    }
                }
            }
        }

        console.timeEnd('doRecipes');

        return ret;
    }

    public doReputations(allCharacters: Character[]) {
        console.time('doReputations');

        const maxReps: Record<number, [number, number]> = {};
        const hasParagons = new Set<number>();
        for (const character of allCharacters) {
            for (const expansion of Object.values(character.reputationData)) {
                for (const reputationSet of expansion.sets) {
                    for (const { reputationId, value } of reputationSet) {
                        const maxRep = maxReps[reputationId]?.[0] || -99999;
                        if (value > maxRep) {
                            maxReps[reputationId] = [value, character.id];
                        } else if (
                            value === maxRep &&
                            !hasParagons.has(reputationId) &&
                            character.paragons?.[reputationId]
                        ) {
                            hasParagons.add(reputationId);
                            maxReps[reputationId] = [value, character.id];
                        }
                    }
                }
            }
        }
        console.log(maxReps);

        console.timeEnd('doReputations');

        return maxReps;
    }

    public doCharacterTasks(character: Character, characterQuests: CharacterQuests) {
        const ret: {
            chores: Record<string, CharacterChore>;
            tasks: Record<string, CharacterTask>;
        } = {
            chores: {},
            tasks: {},
        };

        const charProgressQuests = characterQuests?.progressQuestByKey;
        if (
            character.level === Constants.characterMaxLevel &&
            charProgressQuests?.has('twwDelveGilded') === false
        ) {
            const have = character.weekly?.delveGilded || 0;
            charProgressQuests.set('twwDelveGilded', {
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
            } as UserQuestDataCharacterProgress);
        }

        for (const fullTaskName of settingsState.allTasks) {
            const [taskName, choreName] = fullTaskName.split('|', 2);
            const task = taskMap[taskName];
            if (
                !task ||
                character.ignored ||
                character.level < (task.minimumLevel || Constants.characterMaxLevel) ||
                character.level > (task.maximumLevel || Constants.characterMaxLevel)
            ) {
                continue;
            }

            const activeHoliday = activeHolidays.value[taskName];
            if (
                activeHoliday &&
                holidayMinimumLevel[activeHoliday.holiday.id] &&
                character.level < holidayMinimumLevel[activeHoliday.holiday.id]
            ) {
                continue;
            }

            if (task.type === 'multi') {
                const charChore = new CharacterChore();

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
                                (holidayId) => activeHolidays.value[`h${holidayId}`]
                            )
                        )
                    ) {
                        continue;
                    }

                    if (choreTask.taskKey.endsWith('Split')) {
                        choreTask.taskKey = choreTask.taskKey.slice(0, -5);
                    }

                    let charTask: CharacterChoreTask;
                    if (choreTask.accountWide) {
                        // charTask = accountTasks[choreTask.taskKey] ||= sortBy(
                        //     getNumberKeyedEntries(userState.quests).map(
                        //         ([charId, charQuests]) => {
                        //             const charTask = this.processTask(
                        //                 userState.general.characterById[parseInt(charId)],
                        //                 characterQuests,
                        //                 choreTask,
                        //             );
                        //             return [charTask.status, charQuests.scannedAt, charTask];
                        //         }
                        //     ),
                        //     ([status, scannedAt]) => `${status}|${scannedAt}`
                        // ).at(-1)?.[2] as CharacterChoreTask;
                    } else {
                        charTask = this.processTask(character, characterQuests, choreTask);
                    }

                    if (
                        !charTask.quest &&
                        choreTask.taskKey.endsWith('Treatise') &&
                        !settingsState.value.professions.dragonflightTreatises
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
                        settingsState.value.professions.ignoreTasksWhenDoneWithTraits &&
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
                        ((!settingsState.value.professions.dragonflightCountCraftingDrops &&
                            nameParts[1] === 'Drops') ||
                            (!settingsState.value.professions.dragonflightCountTasks &&
                                nameParts[1] === 'Task') ||
                            (!settingsState.value.professions.dragonflightCountGathering &&
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
                                        characterQuests?.progressQuestByKey?.get(dropKey);

                                    let statusText = '';
                                    if (
                                        progressQuest?.status === QuestStatus.Completed &&
                                        DateTime.fromSeconds(progressQuest.expires) > timeState.time
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
                                    characterQuests?.progressQuestByKey?.get(dropKey);
                                if (
                                    progressQuest?.status === QuestStatus.Completed &&
                                    DateTime.fromSeconds(progressQuest.expires) > timeState.time
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
                        // not a profession hack
                        if (
                            !!charTask.quest &&
                            (!forcedReset[charTask.key] ||
                                DateTime.fromSeconds(charTask.quest.expires) > timeState.time ||
                                (choreTask.taskKey.startsWith('dmf') &&
                                    charTask.quest.expires === 0))
                        ) {
                            charTask.status = charTask.quest.status;
                            if (
                                charTask.status === QuestStatus.InProgress &&
                                charTask.quest.objectives?.length > 0
                            ) {
                                charTask.statusTexts = this.getObjectivesText(
                                    charTask.quest.objectives
                                );
                            }
                        } else if (choreTask.subChores?.length > 0) {
                            let firstChore: Chore = undefined;
                            let firstQuest: UserQuestDataCharacterProgress = undefined;

                            let subCompleted = 0;
                            let subTotal = 0;
                            for (const subChore of choreTask.subChores) {
                                subTotal++;

                                const subQuest = characterQuests?.progressQuestByKey?.get(
                                    subChore.taskKey
                                );
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
                                const starHtml = this.getStarHtml(
                                    false,
                                    firstChore.noProgress || !!firstQuest,
                                    !firstChore.noProgress
                                );

                                if (firstChore.showQuestName) {
                                    if (firstQuest) {
                                        charTask.statusTexts = this.getObjectivesText(
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

                if (charChore.tasks.length === 1) {
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

                ret.chores[fullTaskName] = charChore;
            } else {
                // not multi
                const questKey = progressQuestMap[taskName] || taskName;
                const charTask: CharacterTask = {
                    quest: characterQuests?.progressQuestByKey?.get(questKey),
                    status: undefined,
                    text: undefined,
                };

                if (charTask.quest) {
                    const expires = DateTime.fromSeconds(charTask.quest.expires);
                    if (forcedReset[questKey]) {
                        // quest always resets even if incomplete
                        if (expires < timeState.time) {
                            charTask.quest.status = QuestStatus.NotStarted;
                        }
                    } else {
                        // quest was completed and it's a new week
                        if (
                            charTask.quest.status === QuestStatus.Completed &&
                            expires < timeState.time
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

                ret.tasks[taskName] = charTask;
            }
        } // choreTask of choreTasks

        return ret;
    }

    private processTask(
        character: Character,
        characterQuests: CharacterQuests,
        choreTask: Chore
    ): CharacterChoreTask {
        const charTask = new CharacterChoreTask(choreTask.taskKey, undefined);

        if (!character || !characterQuests) {
            return charTask;
        }

        const charScanned = characterQuests.scannedTime;

        if (choreTask.questReset !== undefined) {
            const questIds = choreTask.questIdFunc?.(character, choreTask) || choreTask.questIds;
            for (const questId of questIds) {
                // is the quest in progress?
                const questProgress = characterQuests?.progressQuestByKey?.get(`q${questId}`);
                if (questProgress) {
                    charTask.quest = questProgress;
                    charTask.status = questProgress.status;

                    if (
                        questProgress.status === QuestStatus.InProgress &&
                        questProgress.objectives?.length > 0
                    ) {
                        charTask.statusTexts = this.getObjectivesText(questProgress.objectives);
                    }

                    if (choreTask.questReset === DbResetType.Custom) {
                        charTask.quest.expires = choreTask
                            .customExpiryFunc(character, charScanned)
                            .toUnixInteger();
                    }

                    break;
                }

                // is the quest completed?
                if (characterQuests?.hasQuestById?.has(questId)) {
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

                    if (expiresAt > timeState.time) {
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
            charTask.quest = characterQuests?.progressQuestByKey?.get(choreTask.taskKey);
            if (charTask.quest) {
                charTask.status = charTask.quest.status;
            }
        }

        if (
            choreTask.taskKey === 'twwChettList' &&
            charTask.status === 0 &&
            (character.getItemCount(235053) > 0 || character.getItemCount(236682) > 0)
        ) {
            charTask.status = 1;
        }

        return charTask;
    }

    private getObjectivesText(objectives: UserQuestDataCharacterProgressObjective[]): string[] {
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

    private getStarHtml(fullState = false, halfState = false, emptyState = false): string {
        if (fullState) {
            return '<span class="status-success">:starFull:</span>';
        } else if (halfState) {
            return '<span class="status-shrug">:starHalf:</span>';
        } else if (emptyState) {
            return '<span class="status-fail">:starEmpty:</span>';
        }

        return 'ERROR';
    }
}
