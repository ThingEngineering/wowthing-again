export interface SidebarItem {
    name: string
    slug: string
    children?: SidebarItem[]
    percent?: number
}
