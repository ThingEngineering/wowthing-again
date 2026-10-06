import { GarrisonType } from '@/enums/garrison-type';
import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Character } from '@/types';
import type { Task } from '@/types/tasks';

const hasGarrison = (char: Character) =>
    char.garrisons?.[GarrisonType.WarlordsOfDraenor]?.level > 0;

export const wodChoresGarrison: Task = {
    key: 'wodGarrison',
    name: '[WoD] Garrison',
    shortName: 'Gar',
    showSeparate: true,
    chores: [
        {
            key: 'wodGarrisonInvasion',
            name: 'Invasion',
            icon: iconLibrary.gameBunkerAssault,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            questResetForced: true,
            couldGetFunc: hasGarrison,
            subChores: [
                {
                    key: 'bronze',
                    name: 'Bronze - {item:120320}',
                    questIds: [37638],
                },
                {
                    key: 'silver',
                    name: 'Silver - {item:120319}',
                    questIds: [37639],
                },
                {
                    key: 'gold',
                    name: 'Gold - {item:116980}',
                    questIds: [37640],
                },
                {
                    key: 'platinum',
                    name: 'Platinum - {item:122163}',
                    questIds: [38482],
                },
            ],
        },
    ],
};
