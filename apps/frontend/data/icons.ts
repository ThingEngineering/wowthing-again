import type { IconifyIcon } from '@iconify/types'

import mdiArrowDownBoldOutline from '@iconify/icons-mdi/arrow-down-bold-outline'
import mdiArrowLeftBoldOutline from '@iconify/icons-mdi/arrow-left-bold-outline'
import mdiArrowRightBoldOutline from '@iconify/icons-mdi/arrow-right-bold-outline'
import mdiArrowUpBoldOutline from '@iconify/icons-mdi/arrow-up-bold-outline'
import mdiCalendar from '@iconify/icons-mdi/calendar-alert'
import mdiCheck from '@iconify/icons-mdi/check'
import mdiChevronDown from '@iconify/icons-mdi/chevron-down'
import mdiChevronRight from '@iconify/icons-mdi/chevron-right'
import mdiChevronUp from '@iconify/icons-mdi/chevron-up'
import mdiClose from '@iconify/icons-mdi/close'
import mdiExclamationThick from '@iconify/icons-mdi/exclamation-thick'
import mdiFormatListCheckbox from '@iconify/icons-mdi/format-list-checkbox'
import mdiGiftOutline from '@iconify/icons-mdi/gift-outline'
import mdiLetterC from '@iconify/icons-mdi/alpha-c-box-outline'
import mdiLetterL from '@iconify/icons-mdi/alpha-l-box-outline'
import mdiLetterM from '@iconify/icons-mdi/alpha-m-box-outline'
import mdiLetterP from '@iconify/icons-mdi/alpha-p-box-outline'
import mdiLightningBoltOutline from '@iconify/icons-mdi/lightning-bolt-outline'
import mdiLockOutline from '@iconify/icons-mdi/lock-outline'
import mdiNumeric1CircleOutline from '@iconify/icons-mdi/numeric-1-circle-outline'
import mdiNumeric2CircleOutline from '@iconify/icons-mdi/numeric-2-circle-outline'
import mdiNumeric3CircleOutline from '@iconify/icons-mdi/numeric-3-circle-outline'
import mdiNumeric4CircleOutline from '@iconify/icons-mdi/numeric-4-circle-outline'
import mdiNumeric5CircleOutline from '@iconify/icons-mdi/numeric-5-circle-outline'
import mdiPageFirst from '@iconify/icons-mdi/page-first'
import mdiPageLast from '@iconify/icons-mdi/page-last'
import mdiPlus from '@iconify/icons-mdi/plus'
import mdiQuestion from '@iconify/icons-mdi/help-circle-outline'
import mdiRocketLaunchOutline from '@iconify/icons-mdi/rocket-launch-outline'
import mdiShieldHalfFull from '@iconify/icons-mdi/shield-half-full'
import mdiSortAlphabeticalAscending from '@iconify/icons-mdi/sort-alphabetical-ascending'
import mdiSortAlphabeticalDescending from '@iconify/icons-mdi/sort-alphabetical-descending'
import mdiSortNumericAscending from '@iconify/icons-mdi/sort-numeric-ascending'
import mdiSortNumericDescending from '@iconify/icons-mdi/sort-numeric-descending'
import mdiStarFace from '@iconify/icons-mdi/star-face'
import mdiStarHalfFull from '@iconify/icons-mdi/star-half-full'
import mdiStarOutline from '@iconify/icons-mdi/star-outline'
import mdiSwordCross from '@iconify/icons-mdi/sword-cross'


import { Constants } from '@/data/constants'


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

    'covenant-kyrian': 'covenant_kyrian',
    'covenant-necrolord': 'covenant_necrolord',
    'covenant-night-fae': 'covenant_night_fae',
    'covenant-venthyr': 'covenant_venthyr',
    hearthstone: 'item/6948',
}

export const iconStrings: Record<string, IconifyIcon> = {
    exclamation: mdiExclamationThick,
    item: mdiGiftOutline,
    lock: mdiLockOutline,
    no: mdiClose,
    plus: mdiPlus,
    question: mdiQuestion,
    rocket: mdiRocketLaunchOutline,
    yes: mdiCheck,

    'arrow-down': mdiArrowDownBoldOutline,
    'arrow-left': mdiArrowLeftBoldOutline,
    'arrow-right': mdiArrowRightBoldOutline,
    'arrow-up': mdiArrowUpBoldOutline,

    'calendar-quest': mdiCalendar,

    'chevron-down': mdiChevronDown,
    'chevron-right': mdiChevronRight,
    'chevron-up': mdiChevronUp,

    circle1: mdiNumeric1CircleOutline,
    circle2: mdiNumeric2CircleOutline,
    circle3: mdiNumeric3CircleOutline,
    circle4: mdiNumeric4CircleOutline,
    circle5: mdiNumeric5CircleOutline,

    'list': mdiFormatListCheckbox,

    'page-first': mdiPageFirst,
    'page-last': mdiPageLast,

    'sort-alpha-down': mdiSortAlphabeticalDescending,
    'sort-alpha-up': mdiSortAlphabeticalAscending,
    'sort-numeric-down': mdiSortNumericDescending,
    'sort-numeric-up': mdiSortNumericAscending,

    armorCloth: mdiLetterC,
    armorLeather: mdiLetterL,
    armorMail: mdiLetterM,
    armorPlate: mdiLetterP,

    starEmpty: mdiStarOutline,
    starHalf: mdiStarHalfFull,
    starFull: mdiStarFace,
}


export const soulbindSockets: Record<number, IconifyIcon> = {
    1: mdiLightningBoltOutline, // Finesse
    2: mdiSwordCross, // Potency
    3: mdiShieldHalfFull, // Endurance
}
