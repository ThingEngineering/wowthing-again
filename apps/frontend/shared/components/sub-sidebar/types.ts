import type { IconifyIcon } from '@iconify/types'


export interface SidebarItem {
    name: string
    slug: string
    children?: SidebarItem[]
    fullUrl?: string
    forceNoVisit?: boolean
    forceWildcard?: boolean
    icon?: IconifyIcon
    id?: number
    percent?: number
}
