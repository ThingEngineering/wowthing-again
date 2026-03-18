import * as iconLibrary from '../library';
import { ItemLocation } from '@/enums/item-location';
import type { Icon } from '@/types/icons';

export const itemLocationIcons: Record<number, Icon> = {
    [ItemLocation.Bags]: iconLibrary.notoBackpack,
    [ItemLocation.Bank]: iconLibrary.notoBank,
    [ItemLocation.GuildBank]: iconLibrary.notoFamilyWomanWomanGirlBoy,
    [ItemLocation.PetCollection]: iconLibrary.notoDogFace,
    [ItemLocation.WarbandBank]: iconLibrary.gameStrongbox,
};
