import type { Icon } from '@/types/icons';

export interface SidebarItem {
    name: string;
    slug: string;
    children?: SidebarItem[];
    fullUrl?: string;
    forceNoVisit?: boolean;
    forceWildcard?: boolean;
    icon?: Icon;
    id?: number;
    percent?: number;
}
