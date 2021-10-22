import type { IconifyIcon } from '@iconify/types'

import mdiAxeBattle from '@iconify/icons-mdi/axe-battle'
import mdiDiceMultiple from '@iconify/icons-mdi/dice-multiple'
import mdiExclamationThick from '@iconify/icons-mdi/exclamation-thick'
import mdiLetterC from '@iconify/icons-mdi/alpha-c-box-outline'
import mdiLetterL from '@iconify/icons-mdi/alpha-l-box-outline'
import mdiLetterM from '@iconify/icons-mdi/alpha-m-box-outline'
import mdiLetterP from '@iconify/icons-mdi/alpha-p-box-outline'
import mdiPuzzle from '@iconify/icons-mdi/puzzle'
import mdiSkull from '@iconify/icons-mdi/skull'
import mdiSpider from '@iconify/icons-mdi/spider'
import mdiTimerSand from '@iconify/icons-mdi/timer-sand'
import mdiTreasureChest from '@iconify/icons-mdi/treasure-chest'
import mdiTshirtCrew from '@iconify/icons-mdi/tshirt-crew'
import mdiUnicorn from '@iconify/icons-mdi/unicorn'
import mdiWizardHat from '@iconify/icons-mdi/wizard-hat'


export const farmType: Record<string, IconifyIcon> = {
    event: mdiTimerSand,
    kill: mdiSkull,
    puzzle: mdiPuzzle,
    treasure: mdiTreasureChest,

    cloth: mdiLetterC,
    leather: mdiLetterL,
    mail: mdiLetterM,
    plate: mdiLetterP,
    weapon: mdiAxeBattle,
}

export const dropType: Record<string, IconifyIcon> = {
    armor: mdiTshirtCrew,
    mount: mdiUnicorn,
    pet: mdiSpider,
    quest: mdiExclamationThick,
    toy: mdiDiceMultiple,
    transmog: mdiWizardHat,
    weapon: mdiAxeBattle,
}
