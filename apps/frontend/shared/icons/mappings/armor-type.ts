import { ArmorType } from '@/enums/armor-type';
import type { Icon } from '@/types/icons';
import * as iconLibrary from '../library';
import { uiIcons } from '../ui';

export const armorTypeIcons: Record<ArmorType, Icon> = {
    [ArmorType.Cloak]: iconLibrary.gameCape,
    [ArmorType.Cloth]: uiIcons.squareC,
    [ArmorType.Leather]: uiIcons.squareL,
    [ArmorType.Mail]: uiIcons.squareM,
    [ArmorType.Plate]: uiIcons.squareP,
    [ArmorType.Tabard]: null,
    [ArmorType.None]: null,
};
