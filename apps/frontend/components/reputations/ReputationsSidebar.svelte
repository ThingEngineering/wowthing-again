<script lang="ts">
    import { manualStore } from '@/stores';
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[] = []
    $: {
        categories = $manualStore.reputationSets.map((set) => set === null ? null : ({
            children: [],
            ...set,
        }))
    }
</script>

<Sidebar
    baseUrl="/reputations"
    items={categories}
    width="12rem"
/>
