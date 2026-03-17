import * as iconLibrary from '../library';
import { LookupType } from '@/enums/lookup-type';
import type { Icon } from '@/types/icons';

export const lookupTypeIcons: Record<number, Icon> = {
    [LookupType.Currency]: iconLibrary.gameTwoCoins,
    [LookupType.Decor]: iconLibrary.gameHouse,
    [LookupType.Illusion]: iconLibrary.mdiAutoFix,
    [LookupType.Mount]: iconLibrary.mdiUnicorn,
    [LookupType.Pet]: iconLibrary.gameFrog,
    [LookupType.Toy]: iconLibrary.mdiDiceMultiple,
    // [LookupType.Transmog]: iconLibrary.mdiWizardHat,
};
