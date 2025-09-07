import uniq from 'lodash/uniq';
import { DateTime } from 'luxon';

import { Constants } from '@/data/constants';
import { expansionMap, expansionOrder } from '@/data/expansion';
import { holidayIds } from '@/data/holidays';
import { taskMap } from '@/data/tasks';
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
import type { UserQuestDataCharacterProgressObjective } from '@/types/data';
import type { Chore, Task } from '@/types/tasks';

import { activeHolidays } from '../activeHolidays.svelte';
import { activeViewTasks } from '../activeViewTasks.svelte';
import { CharacterChore, CharacterTask } from './types/tasks.svelte';
import type { CharacterQuests } from './types';

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

        console.timeEnd('doReputations');

        return maxReps;
    }

    public doActiveViewTasks(character: Character, characterQuests: CharacterQuests) {
        const ret: Record<string, CharacterTask> = {};

        const customTaskMap = $state.snapshot(settingsState.customTaskMap) as Record<string, Task>;
        for (const fullTaskName of activeViewTasks.value) {
            const [taskName, choreName] = fullTaskName.split('|', 2);
            const task = taskMap[taskName] || customTaskMap[taskName];
            if (
                !task ||
                character.ignored ||
                character.level < (task.minimumLevel || 1) ||
                character.level > (task.maximumLevel || Constants.characterMaxLevel)
            ) {
                continue;
            }

            const charTask = (ret[fullTaskName] = new CharacterTask(task));
            const disabledChores = settingsState.activeView.disabledChores?.[fullTaskName] || [];

            for (const chore of task.chores.filter((c) => !!c)) {
                // want a specific chore that isn't this one
                if (choreName && chore.key !== choreName) {
                    continue;
                }

                // don't want a specific chore and this one is disabled
                // if (!choreName && disabledChores.includes(chore.key)) {
                //     continue;
                // }
                const charChore = this.processTaskChore(character, characterQuests, task, chore);
                if (!charChore) {
                    continue;
                }

                charChore.skipped = !choreName && disabledChores.includes(chore.key);

                // let charTask: CharacterChoreTask;
                // if (chore.accountWide) {
                //     // charTask = accountTasks[choreTask.taskKey] ||= sortBy(
                //     //     getNumberKeyedEntries(userState.quests).map(
                //     //         ([charId, charQuests]) => {
                //     //             const charTask = this.processTask(
                //     //                 userState.general.characterById[parseInt(charId)],
                //     //                 characterQuests,
                //     //                 choreTask,
                //     //             );
                //     //             return [charTask.status, charQuests.scannedAt, charTask];
                //     //         }
                //     //     ),
                //     //     ([status, scannedAt]) => `${status}|${scannedAt}`
                //     // ).at(-1)?.[2] as CharacterChoreTask;
                // } else {
                //     charTask = this.processTask(character, characterQuests, chore);
                // }

                if (
                    !charChore.quest &&
                    chore.key.endsWith('Treatise') &&
                    !settingsState.value.professions.dragonflightTreatises
                ) {
                    continue;
                }

                if (charChore.statusTexts.length === 0) {
                    charChore.statusTexts.push(
                        !charChore.quest ? chore.canGetFunc?.(character) || '' : ''
                    );
                }

                if (!charChore.skipped) {
                    charTask.countTotal++;

                    if (charChore.status === QuestStatus.Completed) {
                        charTask.countCompleted++;
                    } else if (charChore.status === QuestStatus.InProgress) {
                        charTask.status ||= QuestStatus.InProgress;
                        charTask.countStarted++;
                        if (
                            charChore.status === QuestStatus.InProgress &&
                            charChore.quest?.objectives?.length > 0
                        ) {
                            charTask.anyReady ||= charChore.quest.objectives.every(
                                (obj) => !!obj.text && obj.have >= obj.need
                            );
                        }
                    }
                }

                charTask.chores[chore.key] = charChore;
            }

            // Propagate chore status to the task
            const statuses = uniq(
                Object.values(charTask.chores)
                    .filter((chore) => !!chore && !chore.skipped)
                    .map((task) => task.status as number)
            );
            if (statuses.length === 1) {
                charTask.status = statuses[0];
            } else if (statuses.length > 1) {
                charTask.status = Math.min(...statuses);
            }

            // Use chore progress if there's only one
            if (charTask.status === QuestStatus.InProgress) {
                const charChores = Object.values(charTask.chores);
                if (charChores.length === 1) {
                    charTask.countCompleted = charChores[0].progressCurrent;
                    charTask.countTotal = charChores[0].progressTotal;
                    charTask.countStarted = charTask.countTotal - charTask.countCompleted;
                }
            }
        } // for fullTaskName

        return ret;
    }

    private processTaskChore(
        character: Character,
        characterQuests: CharacterQuests,
        task: Task,
        chore: Chore
    ): CharacterChore {
        if (!character || !characterQuests) {
            return null;
        }

        if (
            character.level < (chore.minimumLevel || 1) ||
            character.level > (chore.maximumLevel || Constants.characterMaxLevel) ||
            chore.couldGetFunc?.(character, chore) === false
        ) {
            return null;
        }

        // Any chore with required holidays needs at least one active
        if (
            chore.requiredHolidays?.length > 0 &&
            !chore.requiredHolidays.some((holiday) =>
                holidayIds[holiday].some((holidayId) => activeHolidays.value[`h${holidayId}`])
            )
        ) {
            return null;
        }

        const charChore = new CharacterChore(chore.key, undefined);
        const charScanned = characterQuests.scannedTime;

        // if (chore.questReset !== undefined) {
        if (chore.questIds) {
            const questIds =
                typeof chore.questIds === 'function'
                    ? chore.questIds(character, chore)
                    : chore.questIds;
            for (const questId of questIds) {
                // is the quest in progress?
                const questProgress = characterQuests?.progressQuestByKey?.get(`q${questId}`);
                if (questProgress) {
                    charChore.quest = questProgress;
                    charChore.status = questProgress.status;

                    if (
                        questProgress.status === QuestStatus.InProgress &&
                        questProgress.objectives?.length > 0
                    ) {
                        charChore.statusTexts = this.getObjectivesText(questProgress.objectives);
                    }

                    if (chore.questReset === DbResetType.Custom) {
                        charChore.quest.expires = chore
                            .customExpiryFunc(character, charScanned)
                            .toUnixInteger();
                    }

                    break;
                }

                // is the quest completed?
                if (characterQuests?.hasQuestById?.has(questId)) {
                    let expiresAt: DateTime;
                    if (chore.questReset === DbResetType.Weekly) {
                        expiresAt = getNextWeeklyResetFromTime(
                            charScanned,
                            character.realm?.region || Region.US
                        );
                    } else if (chore.questReset === DbResetType.Custom) {
                        expiresAt = chore.customExpiryFunc(character, charScanned);
                    } else if (chore.questReset !== DbResetType.Never) {
                        expiresAt = getNextDailyResetFromTime(
                            charScanned,
                            character.realm?.region || Region.US
                        );
                    }

                    if (chore.questReset === DbResetType.Never || expiresAt > timeState.time) {
                        charChore.progressCurrent = 1;
                        charChore.quest = {
                            expires: expiresAt?.toUnixInteger(),
                            id: questId,
                            name: wowthingData.static.questNameById.get(questId) || chore.name,
                            objectives: [],
                            status: QuestStatus.Completed,
                        };
                    }
                    break;
                }
            }
        } else if (chore.subChores) {
            // sub-chores need to be completed in order
            charChore.progressTotal = 0;
            charChore.statusTexts = [];

            for (const subChore of chore.subChores) {
                const charSubChore = this.processTaskChore(
                    character,
                    characterQuests,
                    task,
                    subChore
                );

                const suffixText = `[${charSubChore.progressCurrent}/${charSubChore.progressTotal}] ${charSubChore.name}`;

                charChore.progressTotal += charSubChore.progressTotal;

                if (charSubChore.status === QuestStatus.Completed) {
                    charChore.progressCurrent += charSubChore.progressCurrent;
                    charChore.statusTexts.push(
                        `<span class="status-success">:starFull:</span> ${suffixText}`
                    );
                } else {
                    charChore.status = Math.max(charChore.status, charSubChore.status);

                    const isFirst = charChore.statusTexts.length === 0;
                    if (
                        charSubChore.status === QuestStatus.InProgress &&
                        (chore.subChoresAnyOrder ||
                            isFirst ||
                            charChore.statusTexts.at(-1).includes(':starFull:'))
                    ) {
                        charChore.progressCurrent += charSubChore.progressCurrent;
                        charChore.statusTexts.push(
                            `<span class="status-shrug">:starHalf:</span> ${suffixText}`
                        );
                    } else {
                        charChore.statusTexts.push(
                            `<span class="status-fail">:starEmpty:</span> ${suffixText}`
                        );
                    }
                }
            }

            if (charChore.progressCurrent === charChore.progressTotal) {
                charChore.status = QuestStatus.Completed;
            }
        } else if (chore.progressFunc) {
            const { have, need } = chore.progressFunc(character);
            charChore.progressCurrent = have;
            charChore.progressTotal = need;

            if (charChore.progressCurrent === charChore.progressTotal) {
                charChore.status = QuestStatus.Completed;
            }
        }

        if (
            chore.key === 'twwChettList' &&
            charChore.status === 0 &&
            (character.getItemCount(235053) > 0 || character.getItemCount(236682) > 0)
        ) {
            charChore.status = 1;
        }

        if (
            charChore.status === QuestStatus.InProgress &&
            charChore.quest?.objectives?.length > 0
        ) {
            const lastObjective = charChore.quest.objectives.at(-1);
            charChore.progressCurrent = lastObjective.have;
            charChore.progressTotal = lastObjective.need;
        }

        if (
            !!charChore.quest &&
            (!chore.questResetForced ||
                DateTime.fromSeconds(charChore.quest.expires) > timeState.time ||
                (chore.key.startsWith('dmf') && charChore.quest.expires === 0))
        ) {
            // charTask maybe?
            charChore.status = charChore.quest.status;
            if (
                charChore.status === QuestStatus.InProgress &&
                charChore.quest.objectives?.length > 0
            ) {
                const lastObjective = charChore.quest.objectives.at(-1);
                charChore.progressCurrent = lastObjective.have;
                charChore.progressTotal = lastObjective.need;

                charChore.statusTexts = this.getObjectivesText(charChore.quest.objectives);
            }
        } else if (chore.noProgress && charChore.status === QuestStatus.NotStarted) {
            charChore.status = QuestStatus.InProgress;
        }

        charChore.name =
            chore.showQuestName || chore.subChores?.length > 0
                ? charChore.quest?.name || chore.name
                : chore.name;

        return charChore;
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
