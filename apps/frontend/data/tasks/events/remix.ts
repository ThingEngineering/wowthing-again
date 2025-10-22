import { Holiday } from '@/enums/holiday';
import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Character } from '@/types';
import type { Task } from '@/types/tasks';

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
            progressFunc: (char) => ({
                have: char.remixResearchHave,
                need: char.remixResearchTotal,
            }),
            couldGetFunc,
        },
    ],
};
