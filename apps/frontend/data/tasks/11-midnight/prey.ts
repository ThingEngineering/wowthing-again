import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Character } from '@/types';
import type { Chore, Task } from '@/types/tasks';
import { userState } from '@/user-home/state/user';

const normalQuestIds: number[] = [
    91114, // Prey: Consul Nebulor (Normal)
    91112, // Prey: Crusader Luxia Maxwell (Normal)
    91100, // Prey: Deliah Gloomsong (Normal)
    91124, // Prey: Dengzag, the Darkened Blaze (Normal)
    91115, // Prey: Executor Kaenius (Normal)
    91123, // Prey: Grothoz, the Burning Shadow (Normal)
    91111, // Prey: High Vindicator Vureem (Normal)
    91116, // Prey: Imperator Enigmalia (Normal)
    91103, // Prey: Jo'zolo the Breaker (Normal)
    91117, // Prey: Knight-Errant Bloodshatter (Normal)
    91098, // Prey: L-N-0R the Recycler (Normal)
    91110, // Prey: Lamyne of the Undercroft (Normal)
    91108, // Prey: Lieutenant Blazewing (Normal)
    91119, // Prey: Lost Theldrin (Normal)
    91095, // Prey: Magister Sunbreaker (Normal)
    91096, // Prey: Magistrix Emberlash (Normal)
    91099, // Prey: Mordril Shadowfell (Normal)
    91102, // Prey: Nexus-Edge Hadim (Normal)
    91120, // Prey: Neydra the Starving (Normal)
    91109, // Prey: Petyoll the Razorleaf (Normal)
    91101, // Prey: Phaseblade Talasha (Normal)
    91113, // Prey: Praetor Singularis (Normal)
    91107, // Prey: Ranger Swiftglade (Normal)
    91097, // Prey: Senior Tinker Ozwold (Normal)
    91105, // Prey: The Talon of Janali (Normal)
    91106, // Prey: The Wing of Akil'zon (Normal)
    91122, // Prey: Thorn-Witch Liset (Normal)
    91121, // Prey: Thornspeaker Edgath (Normal)
    91118, // Prey: Vylenna the Defector (Normal)
    91104, // Prey: Zadu, Fist of Nalorakk (Normal)
];

const hardQuestIds: number[] = [
    91245, // Prey: Consul Nebulor (Hard)
    91243, // Prey: Crusader Luxia Maxwell (Hard)
    91220, // Prey: Deliah Gloomsong (Hard)
    91255, // Prey: Dengzag, the Darkened Blaze (Hard)
    91246, // Prey: Executor Kaenius (Hard)
    91254, // Prey: Grothoz, the Burning Shadow (Hard)
    91242, // Prey: High Vindicator Vureem (Hard)
    91247, // Prey: Imperator Enigmalia (Hard)
    91226, // Prey: Jo'zolo the Breaker (Hard)
    91248, // Prey: Knight-Errant Bloodshatter (Hard)
    91216, // Prey: L-N-0R the Recycler (Hard)
    91240, // Prey: Lamyne of the Undercroft (Hard)
    91236, // Prey: Lieutenant Blazewing (Hard)
    91250, // Prey: Lost Theldrin (Hard)
    91210, // Prey: Magister Sunbreaker (Hard)
    91212, // Prey: Magistrix Emberlash (Hard)
    91218, // Prey: Mordril Shadowfell (Hard)
    91224, // Prey: Nexus-Edge Hadim (Hard)
    91251, // Prey: Neydra the Starving (Hard)
    91238, // Prey: Petyoll the Razorleaf (Hard)
    91222, // Prey: Phaseblade Talasha (Hard)
    91244, // Prey: Praetor Singularis (Hard)
    91234, // Prey: Ranger Swiftglade (Hard)
    91214, // Prey: Senior Tinker Ozwold (Hard)
    91230, // Prey: The Talon of Janali (Hard)
    91232, // Prey: The Wing of Akil'zon (Hard)
    91253, // Prey: Thorn-Witch Liset (Hard)
    91252, // Prey: Thornspeaker Edgath (Hard)
    91249, // Prey: Vylenna the Defector (Hard)
    91228, // Prey: Zadu, Fist of Nalorakk (Hard)
];

const nightmareQuestIds: number[] = [
    91259, // Prey: Consul Nebulor (Nightmare)
    91257, // Prey: Crusader Luxia Maxwell (Nightmare)
    91221, // Prey: Deliah Gloomsong (Nightmare)
    91269, // Prey: Dengzag, the Darkened Blaze (Nightmare)
    91260, // Prey: Executor Kaenius (Nightmare)
    91268, // Prey: Grothoz, the Burning Shadow (Nightmare)
    91256, // Prey: High Vindicator Vureem (Nightmare)
    91261, // Prey: Imperator Enigmalia (Nightmare)
    91227, // Prey: Jo'zolo the Breaker (Nightmare)
    91262, // Prey: Knight-Errant Bloodshatter (Nightmare)
    91217, // Prey: L-N-0R the Recycler (Nightmare)
    91241, // Prey: Lamyne of the Undercroft (Nightmare)
    91237, // Prey: Lieutenant Blazewing (Nightmare)
    91264, // Prey: Lost Theldrin (Nightmare)
    91211, // Prey: Magister Sunbreaker (Nightmare)
    91213, // Prey: Magistrix Emberlash (Nightmare)
    91219, // Prey: Mordril Shadowfell (Nightmare)
    91225, // Prey: Nexus-Edge Hadim (Nightmare)
    91265, // Prey: Neydra the Starving (Nightmare)
    91239, // Prey: Petyoll the Razorleaf (Nightmare)
    91223, // Prey: Phaseblade Talasha (Nightmare)
    91258, // Prey: Praetor Singularis (Nightmare)
    91235, // Prey: Ranger Swiftglade (Nightmare)
    91215, // Prey: Senior Tinker Ozwold (Nightmare)
    91231, // Prey: The Talon of Janali (Nightmare)
    91233, // Prey: The Wing of Akil'zon (Nightmare)
    91267, // Prey: Thorn-Witch Liset (Nightmare)
    91266, // Prey: Thornspeaker Edgath (Nightmare)
    91263, // Prey: Vylenna the Defector (Nightmare)
    91229, // Prey: Zadu, Fist of Nalorakk (Nightmare)
];

const preyFunc = (questIds: number[], index: number) => {
    return (char: Character, chore: Chore) => {
        const charQuests = userState.quests.characterById.get(char.id);
        const completedOrInProgress = questIds.filter(
            (questId) =>
                charQuests.hasQuestById.has(questId) ||
                charQuests.progressQuestByKey.has(`q${questId}`)
        );

        if (completedOrInProgress[index]) {
            return [completedOrInProgress[index]];
        } else {
            return questIds.filter((questId) => !completedOrInProgress.includes(questId));
        }
    };
};

export const midPrey: Task = {
    key: 'midPrey',
    name: '[Mid] Prey',
    shortName: 'Prey',
    minimumLevel: 80,
    showSeparate: true,
    chores: [
        {
            key: 'preyNormal',
            name: 'Normal',
            icon: iconLibrary.notoClownFace,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            subChores: [
                {
                    key: 'prey1',
                    name: 'Prey #1',
                    showQuestName: true,
                    questIds: preyFunc(normalQuestIds, 0),
                },
                {
                    key: 'prey2',
                    name: 'Prey #2',
                    questIds: preyFunc(normalQuestIds, 1),
                },
                {
                    key: 'prey3',
                    name: 'Prey #3',
                    questIds: preyFunc(normalQuestIds, 2),
                },
                {
                    key: 'prey4',
                    name: 'Prey #4',
                    questIds: preyFunc(normalQuestIds, 3),
                },
            ],
        },
        {
            key: 'preyHard',
            name: 'Hard',
            icon: iconLibrary.notoCowboyHatFace,
            minimumLevel: 90,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            subChores: [
                {
                    key: 'prey1',
                    name: 'Prey #1',
                    showQuestName: true,
                    questIds: preyFunc(hardQuestIds, 0),
                },
                {
                    key: 'prey2',
                    name: 'Prey #2',
                    questIds: preyFunc(hardQuestIds, 1),
                },
                {
                    key: 'prey3',
                    name: 'Prey #3',
                    questIds: preyFunc(hardQuestIds, 2),
                },
                {
                    key: 'prey4',
                    name: 'Prey #4',
                    questIds: preyFunc(hardQuestIds, 3),
                },
            ],
        },
        {
            key: 'preyNightmare',
            name: 'Nightmare',
            icon: iconLibrary.notoAngryFaceWithHorns,
            minimumLevel: 90,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            subChores: [
                {
                    key: 'prey1',
                    name: 'Prey #1',
                    showQuestName: true,
                    questIds: preyFunc(nightmareQuestIds, 0),
                },
                {
                    key: 'prey2',
                    name: 'Prey #2',
                    questIds: preyFunc(nightmareQuestIds, 1),
                },
                {
                    key: 'prey3',
                    name: 'Prey #3',
                    questIds: preyFunc(nightmareQuestIds, 2),
                },
                {
                    key: 'prey4',
                    name: 'Prey #4',
                    questIds: preyFunc(nightmareQuestIds, 3),
                },
            ],
        },
    ],
};
