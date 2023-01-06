<script lang="ts">
    import { staticStore } from '@/stores/static'
    import type { SidebarItem } from '@/types'

    import Sidebar from '@/components/sub-sidebar/SubSidebar.svelte'

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
