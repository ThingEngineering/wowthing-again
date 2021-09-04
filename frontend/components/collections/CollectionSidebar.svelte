<script lang="ts">
    import { getContext } from 'svelte'

    import {userStore} from '@/stores'
    import type { SidebarItem } from '@/types'
    import type { CollectionContext } from '@/types/contexts'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    const { route, sets } = getContext('collection') as CollectionContext

    let categories: SidebarItem[] = []
    $: {
        categories = sets.map((set) => set === null ? null : ({
            children: [],
            ...set[0],
        }))
    }

    const percentFunc = function(entry: SidebarItem): number {
        const counts = $userStore.data.setCounts[route][entry.slug]
        if (counts) {
            return counts.have / counts.total * 100
        }
        return 0
    }
</script>

<style lang="scss">
</style>

<Sidebar
    baseUrl={`/${route}`}
    items={categories}
    width="16rem"
    {percentFunc}
/>
