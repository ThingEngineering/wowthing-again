import { Holiday } from '@/enums/holiday';
import { iconLibrary } from '@/shared/icons';
import { timeState } from '@/shared/state/time.svelte';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Character } from '@/types';
import type { Task } from '@/types/tasks';
import { userState } from '@/user-home/state/user';
import { getNextDailyReset, getNextDailyResetFromTime } from '@/utils/get-next-reset';

const couldGetFunc = (char: Character) => char.isRemix;

export const eventRemixLegion: Task = {
    key: 'remixLegion',
    name: '[Remix] Legion',
    shortName: 'Lemix',
    minimumLevel: 1,
    showSeparate: true,
    requiredHolidays: [Holiday.RemixLegion],
    chores: [
        {
            key: 'makeHasteNotWaste',
            name: 'Make Haste Not Waste',
            alwaysStarted: true,
            icon: iconLibrary.gameBigDiamondRing,
            questReset: DbResetType.Daily,
            questIds: [92855],
            couldGetFunc,
        },
        {
            key: 'research',
            name: 'Research',
            alwaysStarted: true,
            icon: iconLibrary.gameNotebook,
            // TODO: this regens at N/day based on what exactly?
            progressFunc: (char) => {
                const ret = {
                    have: char.remixResearchHave,
                    need: char.remixResearchTotal,
                };

                const charQuests = userState.quests.characterById.get(char.id);
                if (charQuests) {
                    let nextDailyReset = getNextDailyResetFromTime(
                        charQuests.scannedTime,
                        char.realm.region,
                        char
                    );
                    if (nextDailyReset < timeState.slowTime) {
                        ret.have = Math.max(ret.have - 3, 0);
                        while (nextDailyReset < timeState.slowTime) {
                            ret.have = Math.max(ret.have - 3, 0);
                            nextDailyReset = nextDailyReset.plus({ days: 1 });
                        }
                    }
                }

                return ret;
            },
            couldGetFunc,
        },
    ],
};
