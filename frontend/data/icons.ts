import type { IconifyIcon } from '@iconify/types'

import mdiArrowDownBoldOutline from '@iconify/icons-mdi/arrow-down-bold-outline'
import mdiArrowLeftBoldOutline from '@iconify/icons-mdi/arrow-left-bold-outline'
import mdiArrowRightBoldOutline from '@iconify/icons-mdi/arrow-right-bold-outline'
import mdiArrowUpBoldOutline from '@iconify/icons-mdi/arrow-up-bold-outline'
import mdiCheck from '@iconify/icons-mdi/check'
import mdiChevronDown from '@iconify/icons-mdi/chevron-down'
import mdiChevronRight from '@iconify/icons-mdi/chevron-right'
import mdiClose from '@iconify/icons-mdi/close'
import mdiExclamationThick from '@iconify/icons-mdi/exclamation-thick'
import mdiLockOutline from '@iconify/icons-mdi/lock-outline'
import mdiPageFirst from '@iconify/icons-mdi/page-first'
import mdiPageLast from '@iconify/icons-mdi/page-last'
import mdiQuestion from '@iconify/icons-mdi/help-circle-outline'
import mdiSortAlphabeticalAscending from '@iconify/icons-mdi/sort-alphabetical-ascending'
import mdiSortAlphabeticalDescending from '@iconify/icons-mdi/sort-alphabetical-descending'
import mdiSortNumericAscending from '@iconify/icons-mdi/sort-numeric-ascending'
import mdiSortNumericDescending from '@iconify/icons-mdi/sort-numeric-descending'

import notoBackpack from '@iconify/icons-noto/backpack'
import notoBank from '@iconify/icons-noto/bank'
import notoDogFace from '@iconify/icons-noto/dog-face'
import notoFamilyWomanWomanGirlBoy from '@iconify/icons-noto/family-woman-woman-girl-boy'

import { Constants } from '@/data/constants'
import { ItemLocation } from '@/types/enums'


export const iconStrings: Record<string, IconifyIcon> = {
    exclamation: mdiExclamationThick,
    lock: mdiLockOutline,
    no: mdiClose,
    question: mdiQuestion,
    yes: mdiCheck,

    'arrow-down': mdiArrowDownBoldOutline,
    'arrow-left': mdiArrowLeftBoldOutline,
    'arrow-right': mdiArrowRightBoldOutline,
    'arrow-up': mdiArrowUpBoldOutline,

    'chevron-down': mdiChevronDown,
    'chevron-right': mdiChevronRight,

    'page-first': mdiPageFirst,
    'page-last': mdiPageLast,

    'sort-alpha-down': mdiSortAlphabeticalDescending,
    'sort-alpha-up': mdiSortAlphabeticalAscending,
    'sort-numeric-down': mdiSortNumericDescending,
    'sort-numeric-up': mdiSortNumericAscending,
}

export const locationIcons: Record<number, IconifyIcon> = {
    [ItemLocation.Bags]: notoBackpack,
    [ItemLocation.Bank]: notoBank,
    [ItemLocation.GuildBank]: notoFamilyWomanWomanGirlBoy,
    [ItemLocation.PetCollection]: notoDogFace,
}

export const imageStrings: Record<string, string> = {
    alliance: Constants.icons.alliance,
    horde: Constants.icons.horde,

    alchemy: 'spell/2259',
    archaeology: 'spell/110393',
    blacksmithing: 'spell/2018',
    cooking: 'spell/2550',
    enchanting: 'spell/7411',
    engineering: 'spell/4036',
    fishing: 'spell/7620',
    herbalism: 'spell/2366',
    inscription: 'spell/45357',
    jewelcrafting: 'spell/25229',
    leatherworking: 'spell/2108',
    mining: 'spell/2575',
    skinning: 'spell/8617',
    tailoring: 'spell/3908',
}
