import { Constants } from '@/data/constants';
import { Holiday, timewalkingHolidays } from '@/enums/holiday';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const eventTimewalking: Task = {
    key: 'eventTimewalking',
    name: '[Event] Timewalking',
    shortName: 'TW',
    minimumLevel: 10,
    showSeparate: true,
    chores: [
        {
            key: 'dungeons',
            name: 'Dungeons',
            minimumLevel: 10,
            requiredHolidays: timewalkingHolidays,
            questReset: DbResetType.Weekly,
            questIds: (char) => {
                if (char.level < Constants.characterMaxLevel) {
                    return [
                        85947, // An Original Journey Through Time [Classic not max]
                        85948, // A Burning Journey Through Time [TBC not max]
                        85949, // A Frozen Journey Through Time [Wrath not max]
                        86556, // A Shattered Journey Through Time [Cata not max]
                        86560, // A Shrouded Journey Through Time [MoP not max]
                        86563, // A Savage Journey Through Time [WoD not max]
                        86564, // A Fel Journey Through Time [Legion not max]
                        88808, // A Scarred Journey Through Time [BfA not max]
                    ];
                } else {
                    return [
                        83274, // An Original Path Through Time [Classic max]
                        83363, // A Burning Path Through Time [TBC max]
                        83365, // A Frozen Path Through Time [Wrath max]
                        83359, // A Shattered Path Through Time [Cata max]
                        83362, // A Shrouded Path Through Time [MoP max]
                        83364, // A Savage Path Through Time [WoD max]
                        83360, // A Fel Path Through Time [Legion max]
                        88805, // A Scarred Path Through Time [BfA max]
                    ];
                }
            },
        },
        {
            key: 'dungeonItem',
            name: 'Dungeon Item',
            requiredHolidays: timewalkingHolidays,
            questReset: DbResetType.Weekly,
            questIds: [
                83285, // Classic
                40168, // TBC
                40173, // WotLK
                40787, // Cata [A]
                40786, // Cata [H]
                45563, // MoP
                55498, // WoD [A]
                55499, // WoD [H]
                64710, // Legion
                89222, // BfA [A]
                89223, // BfA [H]
            ],
        },
        {
            key: 'raid',
            name: 'Raid',
            minimumLevel: 30,
            requiredHolidays: [
                Holiday.TimewalkingTbc,
                Holiday.TimewalkingWotlk,
                Holiday.TimewalkingCata,
            ],
            questIds: [
                47523, // TBC [Black Temple]
                50316, // WotLK [Ulduar]
                57637, // Cata [Firelands]
            ],
            questReset: DbResetType.Weekly,
        },
    ],
};
