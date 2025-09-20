import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';

export const twwChores11_1_0: Task = {
    key: 'twwChores11_1',
    name: '[TWW] 11.1.x',
    shortName: '11.1',
    minimumLevel: 80,
    showSeparate: true,
    chores: [
        {
            key: 'twwUndermineWorldBossFirst',
            name: '[Um] World Boss 1st Kill',
            accountWide: true,
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [89401],
        },
        {
            key: 'twwUndermineCartel',
            name: '[Um] Choose Cartel',
            accountWide: true,
            icon: iconLibrary.mdiListStatus,
            questReset: DbResetType.Weekly,
            questResetForced: true,
            questIds: [
                84951, // Bilgewater Cartel Weekly Contract
                84954, // Blackwater Cartel Weekly Contract
                84952, // Steamwheedle Cartel Weekly Contract
                84953, // Venture Co. Weekly Contract
            ],
        },
        {
            key: 'twwUndermineManyJobs',
            name: '[Um] 10x Shipping & Handling Jobs',
            questIds: [85869], // Many Jobs, Handle It!
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwUndermineReduce',
            name: '[Um] 3x S.C.R.A.P. Jobs',
            icon: iconLibrary.hisTrash,
            questReset: DbResetType.Weekly,
            questIds: [85879], // Reduce, Resuse, Resell
        },
        {
            key: 'twwUndermineSurge',
            name: '[Um] Surge Pricing',
            questReset: DbResetType.Weekly,
            questIds: [86775], // Urge to Surge
        },
        {
            key: 'twwUndermineSpecial',
            name: '[Um] Special Assignment',
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            subChores: [
                {
                    key: 'unlock',
                    name: 'World Quests',
                    questIds: [
                        85489, // Boom! Headshot! Unlock
                        85490, // Security Detail Unlock
                    ],
                },
                {
                    key: 'assignment',
                    name: 'Assignment',
                    alwaysStarted: true,
                    questIds: [
                        85487, // Boom! Headshot!
                        85488, // Security Detail
                    ],
                },
            ],
        },
        // TODO: support something like ChoreTracker "pick n" (N/whatever quests)
        {
            key: 'twwSideGig',
            name: '[Um] Side Gig',
            showQuestName: true,
            questReset: DbResetType.Weekly,
            questIds: [],
        },
        {
            key: 'twwRaidPull',
            name: '[Raid] Rune Dispenser',
            icon: iconLibrary.mdiSlotMachineOutline,
            alwaysStarted: true,
            questReset: DbResetType.Weekly,
            questIds: [89350],
        },
    ],
};
