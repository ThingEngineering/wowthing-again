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
}
