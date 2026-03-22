import { Strings } from '@/data/constants';
import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import { userState } from '@/user-home/state/user';
import type { Task } from '@/types/tasks';

const PREY_REPUTATION_ID = 2764;
const NORMAL_UNLOCK = 93086; // To the Sanctum!
const HEROIC_UNLOCK = 92177; // One Hero's Prey
const NIGHTMARE_UNLOCK = 92182; // The Sheep or the Wolf

const renownFunc = (renown?: number) => {
    if (!renown) {
        return true;
    }

    const repCharacter =
        userState.general.characterById[userState.reputations[PREY_REPUTATION_ID]?.[1]];
    return repCharacter?.reputationData?.['midnight']?.sets?.[2]?.[2]?.value >= renown * 4000;
};

export const midPrey: Task = {
    key: 'midPrey',
    name: '[Mid] Prey',
    shortName: 'Prey',
    minimumLevel: 80,
    showSeparate: true,
    sumChores: true,
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
            canGetFunc: () =>
                userState.quests.anyCharacterHasById.has(NORMAL_UNLOCK)
                    ? ''
                    : Strings.doUnlockQuests,
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
            couldGetFunc: () => renownFunc(1),
            canGetFunc: (char) =>
                userState.quests.anyCharacterHasById.has(HEROIC_UNLOCK)
                    ? ''
                    : Strings.doUnlockQuests,
        },
        {
            key: 'preyNightmare',
            name: 'Nightmare - {item:262346}',
            icon: iconLibrary.notoAngryFaceWithHorns,
            minimumLevel: 90,
            alwaysStarted: true,
            questCount: 2,
            questReset: DbResetType.Weekly,
            questIds: [93170, 93861],
            couldGetFunc: () => renownFunc(4),
            canGetFunc: (char) =>
                userState.quests.anyCharacterHasById.has(NIGHTMARE_UNLOCK)
                    ? ''
                    : Strings.doUnlockQuests,
        },
        {
            key: 'preyNightmarishTask',
            name: 'A Nightmarish Task',
            icon: iconLibrary.notoV1AngryFaceWithHorns,
            minimumLevel: 90,
            questReset: DbResetType.Weekly,
            questIds: [94446],
            couldGetFunc: () => renownFunc(4),
            canGetFunc: (char) =>
                userState.quests.anyCharacterHasById.has(NIGHTMARE_UNLOCK)
                    ? ''
                    : Strings.doUnlockQuests,
        },
    ],
};
