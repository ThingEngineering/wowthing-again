import type { IconifyIcon } from '@iconify/types'

import mdiAxeBattle from '@iconify/icons-mdi/axe-battle'
import mdiDiceMultiple from '@iconify/icons-mdi/dice-multiple'
import mdiExclamationThick from '@iconify/icons-mdi/exclamation-thick'
import mdiPuzzle from '@iconify/icons-mdi/puzzle'
import mdiSkull from '@iconify/icons-mdi/skull'
import mdiSpider from '@iconify/icons-mdi/spider'
import mdiTreasureChest from '@iconify/icons-mdi/treasure-chest'
import mdiTshirtCrew from '@iconify/icons-mdi/tshirt-crew'
import mdiUnicorn from '@iconify/icons-mdi/unicorn'
import mdiWizardHat from '@iconify/icons-mdi/wizard-hat'


export const farmType: Record<string, IconifyIcon> = {
    kill: mdiSkull,
    killBig: mdiSkull,
    puzzle: mdiPuzzle,
    treasure: mdiTreasureChest,
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
