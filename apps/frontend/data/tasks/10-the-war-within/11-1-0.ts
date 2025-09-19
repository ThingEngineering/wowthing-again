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
            questIds: [89401],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwUndermineCartel',
            name: '[Um] Choose Cartel',
            accountWide: true,
            icon: iconLibrary.mdiListStatus,
            questIds: [
                84951, // Bilgewater Cartel Weekly Contract
                84954, // Blackwater Cartel Weekly Contract
                84952, // Steamwheedle Cartel Weekly Contract
                84953, // Venture Co. Weekly Contract
            ],
            questReset: DbResetType.Weekly,
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
            questIds: [85879], // Reduce, Resuse, Resell
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwUndermineSurge',
            name: '[Um] Surge Pricing',
            questIds: [86775], // Urge to Surge
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwUndermineSpecial',
            name: '[Um] Special Assignment',
            noProgress: true,
            questIds: [
                85487, // Boom! Headshot!
                85488, // Security Detail
            ],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwSideGig',
            name: '[Um] Side Gig',
            showQuestName: true,
            questIds: [],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwRaidPull',
            name: '[Raid] Rune Dispenser',
            icon: iconLibrary.mdiSlotMachineOutline,
            noProgress: true,
            questIds: [89350],
            questReset: DbResetType.Weekly,
        },
    ],
};
