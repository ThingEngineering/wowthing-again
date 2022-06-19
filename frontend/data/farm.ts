import type { IconifyIcon } from '@iconify/types'

import hisExclamationCircle from '@iconify/icons-heroicons-solid/exclamation-circle'
import mdiAxeBattle from '@iconify/icons-mdi/axe-battle'
import mdiCart from '@iconify/icons-mdi/cart'
import mdiDiceMultiple from '@iconify/icons-mdi/dice-multiple'
import mdiDuck from '@iconify/icons-mdi/duck'
import mdiExclamationThick from '@iconify/icons-mdi/exclamation-thick'
import mdiLetterC from '@iconify/icons-mdi/alpha-c-box-outline'
import mdiLetterL from '@iconify/icons-mdi/alpha-l-box-outline'
import mdiLetterM from '@iconify/icons-mdi/alpha-m-box-outline'
import mdiLetterP from '@iconify/icons-mdi/alpha-p-box-outline'
import mdiPuzzle from '@iconify/icons-mdi/puzzle'
import mdiSkull from '@iconify/icons-mdi/skull'
import mdiTimerSand from '@iconify/icons-mdi/timer-sand'
import mdiTreasureChest from '@iconify/icons-mdi/treasure-chest'
import mdiTrophy from '@iconify/icons-mdi/trophy'
import mdiTshirtCrew from '@iconify/icons-mdi/tshirt-crew'
import mdiUnicorn from '@iconify/icons-mdi/unicorn'
import mdiWizardHat from '@iconify/icons-mdi/wizard-hat'

import { FarmDropType, FarmType } from '@/types/enums'


export const farmTypeIcon: Record<number, IconifyIcon> = {
    [FarmType.Event]: mdiTimerSand,
    [FarmType.EventBig]: mdiTimerSand,
    [FarmType.Kill]: mdiSkull,
    [FarmType.KillBig]: mdiSkull,
    [FarmType.Puzzle]: mdiPuzzle,
    [FarmType.Quest]: hisExclamationCircle,
    [FarmType.Treasure]: mdiTreasureChest,
    [FarmType.Vendor]: mdiCart,

    [FarmType.Cloth]: mdiLetterC,
    [FarmType.Leather]: mdiLetterL,
    [FarmType.Mail]: mdiLetterM,
    [FarmType.Plate]: mdiLetterP,
    [FarmType.Weapon]: mdiAxeBattle,
}

export const dropTypeIcon: Record<number, IconifyIcon> = {
    [FarmDropType.Achievement]: mdiTrophy,
    [FarmDropType.Armor]: mdiTshirtCrew,
    [FarmDropType.Cosmetic]: mdiWizardHat,
    [FarmDropType.Mount]: mdiUnicorn,
    [FarmDropType.Pet]: mdiDuck,
    [FarmDropType.Quest]: mdiExclamationThick,
    [FarmDropType.Toy]: mdiDiceMultiple,
    [FarmDropType.Weapon]: mdiAxeBattle,
}

export const dropTypeStringIcon: Record<string, IconifyIcon> = {
    mount: mdiUnicorn,
    pet: mdiDuck,
    toy: mdiDiceMultiple,
    transmog: mdiWizardHat,
}
