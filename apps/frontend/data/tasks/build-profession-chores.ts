import { isGatheringProfession, professionIdToSlug } from '@/data/professions';
import { Profession } from '@/enums/profession';
import { wowthingData } from '@/shared/stores/data';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Character } from '@/types';
import type { TaskProfession } from '@/types/data';
import type { Chore } from '@/types/tasks';

export function buildProfessionChores(
    taskProfessions: TaskProfession[],
    expansion: number,
    prefix: string,
    minimumLevel: number
): Chore[] {
    return taskProfessions.flatMap((taskProfession) => {
        const chores: Chore[] = [];

        const name = Profession[taskProfession.id];
        const slug = professionIdToSlug[taskProfession.id];

        const couldGetFunc = (char: Character) =>
            couldGet(char, taskProfession.id, taskProfession.subProfessionId);

        // if (prefix === 'df') {
        //     ret.push({
        //         key: `${prefix}Profession${professionName}Provide`,
        //         name: `${professionName}: Provide`,
        //         minimumLevel,
        //         couldGetFunc: (char) =>
        //             couldGet(char, taskProfession.id, taskProfession.subProfessionId),
        //         canGetFunc: (char) =>
        //             getExpansionSkill(
        //                 char,
        //                 taskProfession.id,
        //                 expansionSlugMap['dragonflight'].id,
        //                 45
        //             ),
        //     });
        // }

        // task, drop, orders, treatise

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

        // chores.push({
        //     key: `${prefix}Profession${name}Treatise`,
        //     name: `${name}: Treatise`,
        //     minimumLevel,
        //     couldGetFunc: (char) => couldGet(char, profession.id, profession.subProfessionId),
        // });

        return chores;
    });
}

function couldGet(char: Character, professionId: number, subProfessionId: number): boolean {
    const profession = wowthingData.static.professionById.get(professionId);
    return !!char.professions?.[profession.id]?.subProfessions?.[subProfessionId];
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
