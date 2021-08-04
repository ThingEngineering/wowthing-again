export interface SidebarItem {
    name: string
    slug: string
    children?: SidebarItem[]
    id?: number
    percent?: number
}
