import type { IconifyIcon } from '@iconify/types'

import mdiCheck from '@iconify/icons-mdi/check'
import mdiClose from '@iconify/icons-mdi/close'
import iconLockOutline from '@iconify/icons-mdi/lock-outline'
import iconQuestion from '@iconify/icons-mdi/help-circle-outline'

import { Constants } from '@/data/constants'


export const iconStrings: Record<string, IconifyIcon> = {
    lock: iconLockOutline,
    no: mdiClose,
    question: iconQuestion,
    yes: mdiCheck,
}

export const imageStrings: Record<string, string> = {
    alliance: Constants.icons.alliance,
    horde: Constants.icons.horde,

    alchemy: 'spell/2259',
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
