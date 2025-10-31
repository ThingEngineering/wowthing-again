import type { IconifyIcon } from '@iconify/types';

import * as iconLibrary from '../library';
import { ArmorType } from '@/enums/armor-type';
import {
    MynauiLetterCSquare,
    MynauiLetterLSquare,
    MynauiLetterMSquare,
    MynauiLetterPSquare,
    type ComponentIcon,
} from '../components';

export const armorTypeIcons: Record<ArmorType, IconifyIcon> = {
    [ArmorType.Cloak]: iconLibrary.gameCape,
    [ArmorType.Cloth]: iconLibrary.mdiLetterC,
    [ArmorType.Leather]: iconLibrary.mdiLetterL,
    [ArmorType.Mail]: iconLibrary.mdiLetterM,
    [ArmorType.Plate]: iconLibrary.mdiLetterP,
    [ArmorType.Tabard]: null,
    [ArmorType.None]: null,
};

export const armorTypeComponents: Record<number, ComponentIcon> = {
    [ArmorType.Cloth]: MynauiLetterCSquare,
    [ArmorType.Leather]: MynauiLetterLSquare,
    [ArmorType.Mail]: MynauiLetterMSquare,
    [ArmorType.Plate]: MynauiLetterPSquare,
};
