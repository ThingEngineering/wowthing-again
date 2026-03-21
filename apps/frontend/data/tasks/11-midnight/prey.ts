import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';
import { userState } from '@/user-home/state/user';

const NORMAL_UNLOCK = 93086; // To the Sanctum!
const HEROIC_UNLOCK = 92177; // One Hero's Prey
const NIGHTMARE_UNLOCK = 92182; // The Sheep or the Wolf

export const midPrey: Task = {
    key: 'midPrey',
    name: '[Mid] Prey',
    shortName: 'Prey',
    minimumLevel: 80,
    showSeparate: true,
    chores: [
        {
            key: 'preyRep',
            name: 'Reputation',
            icon: iconLibrary.gameHeartPlus,
            accountWide: true,
            alwaysStarted: true,
            questCount: 4,
            questIds: [95000, 95001, 95002, 95003],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'preyNormal',
            name: 'Normal - {item:257023}',
            icon: iconLibrary.notoClownFace,
            alwaysStarted: true,
            questCount: 2,
            questReset: DbResetType.Weekly,
            questIds: [93168, 93156],
            couldGetFunc: (char) =>
                userState.quests.characterById.get(char.id)?.hasQuestById?.has(NORMAL_UNLOCK),
        },
        {
            key: 'preyHard',
            name: 'Hard - {item:257026}',
            icon: iconLibrary.notoCowboyHatFace,
            minimumLevel: 90,
            alwaysStarted: true,
            questCount: 2,
            questReset: DbResetType.Weekly,
            questIds: [93169, 93857],
            couldGetFunc: (char) =>
                userState.quests.characterById.get(char.id)?.hasQuestById?.has(HEROIC_UNLOCK),
        },
        {
            key: 'preyNightmare',
            name: 'Nightmare- {item:262346}',
            icon: iconLibrary.notoAngryFaceWithHorns,
            minimumLevel: 90,
            alwaysStarted: true,
            questCount: 2,
            questReset: DbResetType.Weekly,
            questIds: [93170, 93861],
            couldGetFunc: (char) =>
                userState.quests.characterById.get(char.id)?.hasQuestById?.has(NIGHTMARE_UNLOCK),
        },
        {
            key: 'preyNightmarishTask',
            name: 'A Nightmarish Task',
            icon: iconLibrary.notoV1AngryFaceWithHorns,
            minimumLevel: 90,
            questReset: DbResetType.Weekly,
            questIds: [94446],
            couldGetFunc: (char) =>
                userState.quests.characterById.get(char.id)?.hasQuestById?.has(NIGHTMARE_UNLOCK),
        },
    ],
};
