import type { IconifyIcon } from '@iconify/types'

import faDungeon from '@iconify/icons-fa-solid/dungeon'

import hisExclamationCircle from '@iconify/icons-heroicons-solid/exclamation-circle'

import mdiArrowDownBoldOutline from '@iconify/icons-mdi/arrow-down-bold-outline'
import mdiArrowLeftBoldOutline from '@iconify/icons-mdi/arrow-left-bold-outline'
import mdiArrowRightBoldOutline from '@iconify/icons-mdi/arrow-right-bold-outline'
import mdiArrowUpBoldOutline from '@iconify/icons-mdi/arrow-up-bold-outline'
import mdiAxeBattle from '@iconify/icons-mdi/axe-battle'
import mdiCalendar from '@iconify/icons-mdi/calendar-alert'
import mdiCart from '@iconify/icons-mdi/cart'
import mdiCheck from '@iconify/icons-mdi/check'
import mdiChevronDown from '@iconify/icons-mdi/chevron-down'
import mdiChevronRight from '@iconify/icons-mdi/chevron-right'
import mdiClose from '@iconify/icons-mdi/close'
import mdiDiceMultiple from '@iconify/icons-mdi/dice-multiple'
import mdiDuck from '@iconify/icons-mdi/duck'
import mdiExclamationThick from '@iconify/icons-mdi/exclamation-thick'
import mdiGiftOutline from '@iconify/icons-mdi/gift-outline'
import mdiLetterC from '@iconify/icons-mdi/alpha-c-box-outline'
import mdiLetterL from '@iconify/icons-mdi/alpha-l-box-outline'
import mdiLetterM from '@iconify/icons-mdi/alpha-m-box-outline'
import mdiLetterP from '@iconify/icons-mdi/alpha-p-box-outline'
import mdiLightningBoltOutline from '@iconify/icons-mdi/lightning-bolt-outline'
import mdiLockOutline from '@iconify/icons-mdi/lock-outline'
import mdiPageFirst from '@iconify/icons-mdi/page-first'
import mdiPageLast from '@iconify/icons-mdi/page-last'
import mdiPuzzle from '@iconify/icons-mdi/puzzle'
import mdiQuestion from '@iconify/icons-mdi/help-circle-outline'
import mdiRocketLaunchOutline from '@iconify/icons-mdi/rocket-launch-outline'
import mdiShieldHalfFull from '@iconify/icons-mdi/shield-half-full'
import mdiSkull from '@iconify/icons-mdi/skull'
import mdiSortAlphabeticalAscending from '@iconify/icons-mdi/sort-alphabetical-ascending'
import mdiSortAlphabeticalDescending from '@iconify/icons-mdi/sort-alphabetical-descending'
import mdiSortNumericAscending from '@iconify/icons-mdi/sort-numeric-ascending'
import mdiSortNumericDescending from '@iconify/icons-mdi/sort-numeric-descending'
import mdiSwordCross from '@iconify/icons-mdi/sword-cross'
import mdiTimerSand from '@iconify/icons-mdi/timer-sand'
import mdiTreasureChest from '@iconify/icons-mdi/treasure-chest'
import mdiTrophy from '@iconify/icons-mdi/trophy'
import mdiTshirtCrew from '@iconify/icons-mdi/tshirt-crew'
import mdiUnicorn from '@iconify/icons-mdi/unicorn'
import mdiWizardHat from '@iconify/icons-mdi/wizard-hat'

import notoBackpack from '@iconify/icons-noto/backpack'
import notoBank from '@iconify/icons-noto/bank'
import notoDogFace from '@iconify/icons-noto/dog-face'
import notoFamilyWomanWomanGirlBoy from '@iconify/icons-noto/family-woman-woman-girl-boy'


import { Constants } from '@/data/constants'
import { FarmType, ItemLocation } from '@/types/enums'
import { RewardType,  } from '@/types/enums'


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

export const iconStrings: Record<string, IconifyIcon> = {
    exclamation: mdiExclamationThick,
    lock: mdiLockOutline,
    no: mdiClose,
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

export const farmTypeIcons: Record<number, IconifyIcon> = {
    [FarmType.Dungeon]: faDungeon,
    [FarmType.Event]: mdiTimerSand,
    [FarmType.EventBig]: mdiTimerSand,
    [FarmType.Kill]: mdiSkull,
    [FarmType.KillBig]: mdiSkull,
    [FarmType.Puzzle]: mdiPuzzle,
    [FarmType.Quest]: hisExclamationCircle,
    [FarmType.Raid]: faDungeon,
    [FarmType.Treasure]: mdiTreasureChest,
    [FarmType.Vendor]: mdiCart,

    [FarmType.Cloth]: mdiLetterC,
    [FarmType.Leather]: mdiLetterL,
    [FarmType.Mail]: mdiLetterM,
    [FarmType.Plate]: mdiLetterP,
    [FarmType.Weapon]: mdiAxeBattle,
}

export const rewardTypeIcons: Record<number, IconifyIcon> = {
    [RewardType.Achievement]: mdiTrophy,
    [RewardType.Armor]: mdiTshirtCrew,
    [RewardType.Cosmetic]: mdiWizardHat,
    [RewardType.Item]: mdiGiftOutline,
    [RewardType.Mount]: mdiUnicorn,
    [RewardType.Pet]: mdiDuck,
    [RewardType.Quest]: mdiExclamationThick,
    [RewardType.Toy]: mdiDiceMultiple,
    [RewardType.Transmog]: mdiWizardHat,
    [RewardType.Weapon]: mdiAxeBattle,

    [RewardType.InstanceSpecial]: faDungeon,
}

export const soulbindSockets: Record<number, IconifyIcon> = {
    1: mdiLightningBoltOutline, // Finesse
    2: mdiSwordCross, // Potency
    3: mdiShieldHalfFull, // Endurance
}
