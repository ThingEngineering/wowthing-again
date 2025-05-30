<script lang="ts">
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types';

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte';
    import { wowthingData } from '@/shared/stores/data';

    let categories: SidebarItem[] = wowthingData.manual.progressSets.map((set) =>
        set === null
            ? null
            : {
                  children: set.slice(1).filter((cat) => cat !== null),
                  ...set[0],
              },
    );
</script>

<Sidebar baseUrl="/progress" items={categories} scrollable={true} width="12rem" />
