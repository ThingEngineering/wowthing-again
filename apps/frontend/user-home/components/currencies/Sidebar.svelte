<script lang="ts">
    import { categoryChildren, categoryOrder } from '@/data/currencies';
    import { wowthingData } from '@/shared/stores/data';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';

    let categories = categoryOrder.map((id) =>
        id === 0
            ? null
            : {
                  children: categoryChildren[id] || [],
                  ...wowthingData.static.currencyCategoryById.get(id),
              }
    ) as SidebarItem[];
</script>

<Sidebar alwaysExpand={true} baseUrl="/currencies" items={categories} width="12rem" />
