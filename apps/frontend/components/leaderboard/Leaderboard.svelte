<script lang="ts">
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './LeaderboardSidebar.svelte'
    import View from './LeaderboardView.svelte'

    export let params: MultiSlugParams
</script>

<Sidebar />

{#if params.slug1}
    <View
        page={params.slug2 ? parseInt(params.slug2) || 1 : 1}
        slug={params.slug1}
    />
{/if}
