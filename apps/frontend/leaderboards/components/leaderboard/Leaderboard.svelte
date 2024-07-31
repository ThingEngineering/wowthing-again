<script lang="ts">
    import type { MultiSlugParams } from '@/types/params'

    import Sidebar from './Sidebar.svelte'
    import View from './View.svelte'

    export let params: MultiSlugParams
</script>

<Sidebar />

{#if params.slug1}
    <View
        page={parseInt(params.slug2) || 0}
        slug={params.slug1}
    />
{/if}
