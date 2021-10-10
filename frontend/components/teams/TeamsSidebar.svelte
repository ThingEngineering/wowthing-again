<script lang="ts">
    import { userTeamStore } from '@/stores'
    import type {SidebarItem} from '@/types'

    import Sidebar from '@/components/sidebar/Sidebar.svelte'

    let categories: SidebarItem[]
    $: {
        categories = Object.values($userTeamStore.data.teams)
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
