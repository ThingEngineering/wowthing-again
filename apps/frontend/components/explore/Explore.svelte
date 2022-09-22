<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Achievements from './ExploreAchievements.svelte'
    import Sidebar from './ExploreSidebar.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('explore', params.slug1))
</script>

<Sidebar />
{#if params.slug1 === 'achievements'}
    <Achievements />
{/if}
