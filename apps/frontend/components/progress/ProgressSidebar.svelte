<script lang="ts">
    import { manualStore } from '@/stores'
    import type { SidebarItem } from '@/shared/components/sub-sidebar/types'

    import Sidebar from '@/shared/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[] = []
    $: {
        categories = $manualStore.progressSets.map((set) => set === null ? null : ({
            children: set.slice(1).filter((cat) => cat !== null),
            ...set[0],
        }))
    }
</script>

<Sidebar
    baseUrl="/progress"
    items={categories}
    scrollable={true}
    width="12rem"
/>
