<script lang="ts">
    import { staticStore } from '@/stores/static'
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[] = []
    $: {
        categories = $staticStore.data.progress.map((set) => set === null ? null : ({
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
