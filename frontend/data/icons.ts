import type { IconifyIcon } from '@iconify/types'

import mdiCheck from '@iconify/icons-mdi/check'
import mdiClose from '@iconify/icons-mdi/close'
import iconLockOutline from '@iconify/icons-mdi/lock-outline'


export const iconStrings: Record<string, IconifyIcon> = {
    lock: iconLockOutline,
    no: mdiClose,
    yes: mdiCheck,
}
