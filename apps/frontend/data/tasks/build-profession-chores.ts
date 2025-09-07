import { isGatheringProfession, professionIdToSlug } from '@/data/professions';
import { Profession } from '@/enums/profession';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Character } from '@/types';
import type { TaskProfession } from '@/types/data';
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

        if (taskProfession.taskQuests) {
            chores.push({
                key: `${name}Task`,
                name: `${name}: Task`,
                showQuestName: true,
                questIds: taskProfession.taskQuests.map((taskQuest) => taskQuest.questId),
                questReset: DbResetType.Weekly,
                couldGetFunc,
                canGetFunc: (char) => getExpansionSkill(char, taskProfession.id, expansion, 25),
            });
        }

        if (taskProfession.dropQuests) {
            chores.push({
                key: `${name}Drops`,
                name: `${name}: Drops`,
                noProgress: true,
                subChoresAnyOrder: true,
                subChores: taskProfession.dropQuests.map((taskQuest, index) => ({
                    key: `drop${index}`,
                    name: `{item:${taskQuest.itemId}}`,
                    noProgress: true,
                    questIds: [taskQuest.questId],
                    questReset: DbResetType.Weekly,
                })),
                couldGetFunc,
                canGetFunc: (char) => getExpansionSkill(char, taskProfession.id, expansion, 1),
            });
        }

        // gather quests are sequential, use sub-chores
        if (taskProfession.gatherQuests) {
            chores.push({
                key: `${name}Gather`,
                name: `${name}: Gather`,
                noProgress: true,
                subChores: taskProfession.gatherQuests.map((taskQuest, index) => ({
                    key: `gather${index}`,
                    name: `{item:${taskQuest.itemId}}`,
                    noProgress: true,
                    showQuestName: true,
                    questIds: [taskQuest.questId],
                    questReset: DbResetType.Weekly,
                })),
                couldGetFunc,
                canGetFunc: (char) => getExpansionSkill(char, taskProfession.id, expansion, 1),
            });
        }

        if (taskProfession.treatiseQuest) {
            chores.push({
                key: `${name}Treatise`,
                name: `${name}: Treatise`,
                subChores: [
                    {
                        key: 'treatise',
                        name: `{item:${taskProfession.treatiseQuest.itemId}}`,
                        noProgress: true,
                        questIds: [taskProfession.treatiseQuest.questId],
                        questReset: DbResetType.Weekly,
                    },
                ],
                couldGetFunc,
                canGetFunc: (char) => getExpansionSkill(char, taskProfession.id, expansion, 1),
            });
        }

        if (taskProfession.orderQuests) {
            chores.push({
                key: `${name}Orders`,
                name: `${name}: Orders`,
                questIds: taskProfession.orderQuests.map((taskQuest) => taskQuest.questId),
                questReset: DbResetType.Weekly,
                couldGetFunc,
                canGetFunc: (char) => getExpansionSkill(char, taskProfession.id, expansion, 25),
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
    expansion: number,
    minSkill: number
): string {
    const currentSubProfession =
        wowthingData.static.professionById.get(professionId).expansionSubProfession[expansion];
    const skill =
        char.professions[professionId].subProfessions[currentSubProfession?.id]?.skillCurrent ?? 0;

    return skill < minSkill ? `Need ${minSkill} skill` : '';
}
