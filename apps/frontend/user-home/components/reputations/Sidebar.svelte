<script lang="ts">
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';
    import { wowthingData } from '@/shared/stores/data';

    let categories: SidebarItem[] = wowthingData.manual.reputationSets.map((set) =>
        set === null
            ? null
            : ({
                  children: [],
                  ...set,
              } as SidebarItem),
    );
</script>

<Sidebar baseUrl="/reputations" items={categories} width="12rem" />
