import { Profession } from '@/enums/profession';
import { settingsState } from '@/shared/state/settings.svelte';
import { DbResetType } from '@/shared/stores/db/enums';
import { userState } from '@/user-home/state/user';
import type { Character } from '@/types';
import type { TaskProfession, TaskProfessionQuest } from '@/types/data';
import type { Chore } from '@/types/tasks';

export function buildProfessionChores(
    expansion: number,
    taskProfessions: TaskProfession[]
): Chore[] {
    return taskProfessions.flatMap((taskProfession) => {
        const chores: Chore[] = [];

        const name = Profession[taskProfession.id];

        const couldGetFunc = (char: Character) =>
            couldGet(char, taskProfession.id, taskProfession.subProfessionId);

        if (taskProfession.provideQuests) {
            chores.push({
                key: `${name}Provide`,
                name: `${name}: Provide`,
                showQuestName: true,
                questIds: taskProfession.provideQuests.map((taskQuest) => taskQuest.questId),
                questReset: DbResetType.Weekly,
                couldGetFunc,
                canGetFunc: (char) =>
                    getExpansionSkill(char, taskProfession.id, taskProfession.subProfessionId, 25),
            });
        }

        if (taskProfession.taskQuests) {
            chores.push({
                key: `${name}Task`,
                name: `${name}: Task`,
                showQuestName: true,
                questIds: taskProfession.taskQuests.map((taskQuest) => taskQuest.questId),
                questReset: DbResetType.Weekly,
                couldGetFunc,
                canGetFunc: (char) =>
                    getExpansionSkill(char, taskProfession.id, taskProfession.subProfessionId, 25),
            });
        }

        if (taskProfession.dropQuests) {
            chores.push({
                key: `${name}Drops`,
                name: `${name}: Drops`,
                alwaysStarted: true,
                subChoresAnyOrder: true,
                questReset: DbResetType.Weekly,
                subChores: taskProfession.dropQuests.map((taskQuest, index) => ({
                    key: `drop${index}`,
                    name: `{item:${taskQuest.itemId}}`,
                    alwaysStarted: true,
                    questIds: [taskQuest.questId],
                })),
                couldGetFunc,
                canGetFunc: (char) =>
                    getExpansionSkill(char, taskProfession.id, taskProfession.subProfessionId, 1),
            });
        }

        if (taskProfession.gatherQuests) {
            chores.push({
                key: `${name}Gather`,
                name: `${name}: Gather`,
                alwaysStarted: true,
                questReset: DbResetType.Weekly,
                subChores: buildGatherSubChores(taskProfession.gatherQuests),
                couldGetFunc,
                canGetFunc: (char) =>
                    getExpansionSkill(char, taskProfession.id, taskProfession.subProfessionId, 1),
            });
        }

        if (taskProfession.treatiseQuest) {
            chores.push({
                key: `${name}Treatise`,
                name: `${name}: Treatise`,
                questReset: DbResetType.Weekly,
                subChores: [
                    {
                        key: 'treatise',
                        name: `{item:${taskProfession.treatiseQuest.itemId}}`,
                        alwaysStarted: true,
                        questIds: [taskProfession.treatiseQuest.questId],
                    },
                ],
                couldGetFunc,
                canGetFunc: (char) =>
                    getExpansionSkill(char, taskProfession.id, taskProfession.subProfessionId, 1),
            });
        }

        if (taskProfession.orderQuest) {
            chores.push({
                key: `${name}Orders`,
                name: `${name}: Orders`,
                questReset: DbResetType.Weekly,
                questIds: [taskProfession.orderQuest.questId],
                couldGetFunc,
                canGetFunc: (char) =>
                    getExpansionSkill(char, taskProfession.id, taskProfession.subProfessionId, 25),
            });
        }

        return chores;
    });
}

function couldGet(character: Character, professionId: number, subProfessionId: number): boolean {
    const characterProfession = character.professions?.[professionId];

    if (!characterProfession?.subProfessions?.[subProfessionId]) {
        return false;
    }

    if (settingsState.value.professions.ignoreTasksWhenDoneWithTraits) {
        const traitStats = characterProfession.subProfessionTraitStats?.[subProfessionId];
        return traitStats?.percent !== 100;
    }

    return true;
}

function getExpansionSkill(
    char: Character,
    professionId: number,
    subprofessionId: number,
    minSkill: number
): string {
    const skill = char.professions[professionId].subProfessions[subprofessionId]?.skillCurrent ?? 0;
    return skill < minSkill ? `Need ${minSkill} skill` : '';
}
function buildGatherSubChores(gatherQuests: TaskProfessionQuest[]): Chore[] {
    // group by itemId first
    const itemOrder: number[] = [];
    const byItem: Record<number, TaskProfessionQuest[]> = {};
    for (const gatherQuest of gatherQuests) {
        if (!byItem[gatherQuest.itemId]) {
            itemOrder.push(gatherQuest.itemId);
            byItem[gatherQuest.itemId] = [];
        }
        byItem[gatherQuest.itemId].push(gatherQuest);
    }

    // build out chores
    return itemOrder.map((itemId, index) => ({
        key: `gather${index}`,
        name: `{item:${itemId}}`,
        alwaysStarted: true,
        showQuestName: true,
        progressFunc: (char) => ({
            have: byItem[itemId].filter((gatherQuest) =>
                userState.quests.characterById.get(char.id)?.hasQuestById?.has(gatherQuest.questId)
            ).length,
            need: byItem[itemId].length,
        }),
    }));
    // return gatherQuests.map((taskQuest, index) => ({
    //     key: `gather${index}`,
    //     name: `{item:${taskQuest.itemId}}`,
    //     alwaysStarted: true,
    //     showQuestName: true,
    //     questIds: [taskQuest.questId],
    // }));
}
