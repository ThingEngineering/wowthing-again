<script lang="ts">
    import { staticStore } from '@/stores/static'
    import type { SidebarItem } from '@/shared/sub-sidebar/types'

    import Sidebar from '@/shared/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[] = []
    $: {
        categories = $staticStore.reputationSets.map((set) => set === null ? null : ({
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
