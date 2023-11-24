import type { IconifyIcon } from '@iconify/types'

import { Constants } from '@/data/constants'
import { iconLibrary } from '@/shared/icons'


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
    'druid-aquatic': 'spell/276012',
    'druid-bear': 'spell/5487',
    'druid-cat': 'spell/768',
    'druid-flight': 'spell/165962',
    'druid-moonkin': 'spell/24858',
    'druid-travel': 'spell/783',
    hearthstone: 'item/6948',

    'bronze-medal': 'achievement/8888',
    'silver-medal': 'achievement/8889', // Mechanized Mackerel
    'gold-medal': 'achievement/8890',
}

export const iconStrings: Record<string, IconifyIcon> = {
    exclamation: iconLibrary.mdiExclamationThick,
    item: iconLibrary.mdiGiftOutline,
    plus: iconLibrary.mdiPlus,
    question: iconLibrary.mdiQuestion,
    rocket: iconLibrary.mdiRocketLaunchOutline,

    'arrow-down': iconLibrary.mdiArrowDownBoldOutline,
    'arrow-left': iconLibrary.mdiArrowLeftBoldOutline,
    'arrow-right': iconLibrary.mdiArrowRightBoldOutline,
    'arrow-up': iconLibrary.mdiArrowUpBoldOutline,

    'calendar-quest': iconLibrary.mdiCalendar,

    'chevron-down': iconLibrary.mdiChevronDown,
    'chevron-right': iconLibrary.mdiChevronRight,
    'chevron-up': iconLibrary.mdiChevronUp,

    circle1: iconLibrary.mdiNumeric1CircleOutline,
    circle2: iconLibrary.mdiNumeric2CircleOutline,
    circle3: iconLibrary.mdiNumeric3CircleOutline,
    circle4: iconLibrary.mdiNumeric4CircleOutline,
    circle5: iconLibrary.mdiNumeric5CircleOutline,

    'list': iconLibrary.mdiFormatListCheckbox,

    'page-first': iconLibrary.mdiPageFirst,
    'page-last': iconLibrary.mdiPageLast,

    'sort-alpha-down': iconLibrary.mdiSortAlphabeticalDescending,
    'sort-alpha-up': iconLibrary.mdiSortAlphabeticalAscending,
    'sort-numeric-down': iconLibrary.mdiSortNumericDescending,
    'sort-numeric-up': iconLibrary.mdiSortNumericAscending,

    armorCloth: iconLibrary.mdiLetterC,
    armorLeather: iconLibrary.mdiLetterL,
    armorMail: iconLibrary.mdiLetterM,
    armorPlate: iconLibrary.mdiLetterP,
}


export const soulbindSockets: Record<number, IconifyIcon> = {
    1: iconLibrary.mdiLightningBoltOutline, // Finesse
    2: iconLibrary.mdiSwordCross, // Potency
    3: iconLibrary.mdiShieldHalfFull, // Endurance
}
