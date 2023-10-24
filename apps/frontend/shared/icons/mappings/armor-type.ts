import type { IconifyIcon } from '@iconify/types'

import * as iconLibrary from '../library'
import { ArmorType } from '@/enums/armor-type'


export const armorTypeIcons: Record<ArmorType, IconifyIcon> = {
    [ArmorType.Cloak]: iconLibrary.gameCape,
    [ArmorType.Cloth]: null,
    [ArmorType.Leather]: null,
    [ArmorType.Mail]: null,
    [ArmorType.Plate]: null,
    [ArmorType.Tabard]: null,
}
