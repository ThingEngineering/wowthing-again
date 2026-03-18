import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const midDelves: Task = {
    key: 'midDelves',
    name: '[Mid] Delves',
    shortName: 'Delve',
    minimumLevel: 80,
    showSeparate: true,
    chores: [
        // {
        //     key: 'map',
        //     name: '{item:252415}',
        //     icon: iconLibrary.GameTreasureMap,
        //     minimumLevel: 80,
        //     alwaysStarted: true,
        //     questReset: DbResetType.Weekly,
        //     questIds: [],
        // },
        // null,
        {
            key: 'arcaneRemnant',
            name: '{item:262586}',
            icon: iconLibrary.gameUnstableOrb,
            minimumLevel: 80,
            accountWide: true,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            questIds: [93784],
        },
        // {
        //     key: 'nullaeus',
        //     name: "Nullaeus Invasion",
        //     minimumLevel: 90,
        //     alwaysStarted: true,
        //     questIds: [], // ??
        //     questReset: DbResetType.Weekly,
        // },
    ],
};
