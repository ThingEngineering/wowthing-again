import * as iconLibrary from '../library';
import { ArmorType } from '@/enums/armor-type';
import type { Icon } from '@/types/icons';

export const armorTypeIcons: Record<ArmorType, Icon> = {
    [ArmorType.Cloak]: iconLibrary.gameCape,
    [ArmorType.Cloth]: iconLibrary.MynauiLetterCSquare,
    [ArmorType.Leather]: iconLibrary.MynauiLetterLSquare,
    [ArmorType.Mail]: iconLibrary.MynauiLetterMSquare,
    [ArmorType.Plate]: iconLibrary.MynauiLetterPSquare,
    // [ArmorType.Cloth]: iconLibrary.mdiLetterC,
    // [ArmorType.Leather]: iconLibrary.mdiLetterL,
    // [ArmorType.Mail]: iconLibrary.mdiLetterM,
    // [ArmorType.Plate]: iconLibrary.mdiLetterP,
    [ArmorType.Tabard]: null,
    [ArmorType.None]: null,
};
