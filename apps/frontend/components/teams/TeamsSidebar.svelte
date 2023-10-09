<script lang="ts">
    import { userTeamStore } from '@/stores'
    import type { SidebarItem } from '@/shared/sub-sidebar/types'

    import Sidebar from '@/shared/sub-sidebar/SubSidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = Object.values($userTeamStore.teams)
        if (categories.length > 0) {
            categories.push(null)
        }

        categories.push({
            name: 'Create Team',
            slug: 'create-team',
        })
    }
</script>

<Sidebar
    baseUrl="/teams"
    items={categories}
    width="16rem"
/>
