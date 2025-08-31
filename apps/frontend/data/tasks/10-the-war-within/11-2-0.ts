import { Constants } from '@/data/constants';
import { iconLibrary } from '@/shared/icons';
import { DbResetType } from '@/shared/stores/db/enums';
import type { Task } from '@/types/tasks';
import { userState } from '@/user-home/state/user';

export const twwChores11_2_0: Task = {
    key: 'twwChores11_2_0',
    name: '[TWW] 11.2.x',
    shortName: '11.2',
    minimumLevel: 80,
    showSeparate: true,
    chores: [
        {
            key: 'twwMoreThanPhase',
            name: '[W][A] More Than Just a Phase',
            // accountWide: true,
            icon: iconLibrary.mdiSwimDive,
            questIds: [91093],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
        },
        {
            key: 'twwWarrant',
            name: '[W][A] Warrant',
            accountWide: true,
            questIds: [
                90122, // Eliminate Xy'vox the Twisted
                90123, // Eliminate Hollowbane
                90124, // Eliminate Shatterpulse
                90125, // Eliminate Purple Peat
                90126, // Eliminate Grubber
                90127, // Eliminate Arcana-Monger So'zer
            ],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwReshanor',
            name: '[W][A] World Boss',
            accountWide: true,
            icon: iconLibrary.emojiZzz,
            questIds: [87352],
            questReset: DbResetType.Weekly,
        },
        {
            key: 'twwKareshSpecialUnlock',
            name: '[W] Special Unlock',
            icon: iconLibrary.mdiLockOutline,
            questIds: [
                91193, // Overshadowed Unlock
                91203, // Aligned Views Unlock
            ],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
        },

        {
            key: 'twwKareshSpecial',
            name: '[W] Special Assignment',
            icon: iconLibrary.gameScrollQuill,
            noProgress: true,
            showQuestName: true,
            questIds: [
                89293, // Overshadowed
                89294, // Aligned Views
            ],
            questReset: DbResetType.Weekly,
            couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
        },
        {
            key: 'twwEcologicalSuccession',
            name: '[W] Ecological Succession',
            icon: iconLibrary.gameBearFace,
            questIds: [85460],
            questReset: DbResetType.Weekly,
            couldGetFunc: () => userState.quests.anyCharacterHasById.has(85262), // The Royal Procession
        },
        {
            key: 'twwMakingDeposit1',
            name: '[W] Anima: Atrium',
            // maybe these need to be subChores?
            questIds: [89062], // Devourer Attack: The Atrium
            questReset: DbResetType.Weekly,
            couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
        },
        {
            key: 'twwMakingDeposit2',
            name: '[W] Anima: Eco-dome',
            questIds: [89061], // Devourer Attack: Eco-dome: Primus
            questReset: DbResetType.Weekly,
            couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
        },
        {
            key: 'twwMakingDeposit3',
            name: '[W] Anima: Oasis',
            questIds: [85722], // Devourer Attack: The Oasis
            questReset: DbResetType.Weekly,
            couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
        },
        {
            key: 'twwMakingDeposit4',
            name: '[W] Anima: Tazavesh',
            questIds: [89063], // Devourer Attack: Tazavesh
            questReset: DbResetType.Weekly,
            couldGetFunc: (char) => char.getItemCount(Constants.items.reshiiWraps) > 0,
        },
    ],
};
