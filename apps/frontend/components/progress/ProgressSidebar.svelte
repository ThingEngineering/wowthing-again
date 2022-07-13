<script lang="ts">
    import { manualStore } from '@/stores'
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[] = []
    $: {
        categories = $manualStore.data.progressSets.map((set) => set === null ? null : ({
            children: set.slice(1).filter((cat) => cat !== null),
            ...set[0],
        }))
    }
</script>

<Sidebar
    baseUrl="/progress"
    items={categories}
    width="12rem"
/>
