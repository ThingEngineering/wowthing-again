import type { IconifyIcon } from '@iconify/types'


export interface SidebarItem {
    name: string
    slug: string
    children?: SidebarItem[]
    id?: number
    percent?: number
    icon?: IconifyIcon
}
