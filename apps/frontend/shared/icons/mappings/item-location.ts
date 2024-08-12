import type { IconifyIcon } from '@iconify/types';

import * as iconLibrary from '../library';
import { ItemLocation } from '@/enums/item-location';

export const itemLocationIcons: Record<number, IconifyIcon> = {
    [ItemLocation.Bags]: iconLibrary.notoBackpack,
    [ItemLocation.Bank]: iconLibrary.notoBank,
    [ItemLocation.GuildBank]: iconLibrary.notoFamilyWomanWomanGirlBoy,
    [ItemLocation.PetCollection]: iconLibrary.notoDogFace,
    [ItemLocation.WarbandBank]: iconLibrary.gameStrongbox,
};
