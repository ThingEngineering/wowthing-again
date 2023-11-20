<script lang="ts">
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './Sidebar.svelte'
    import View from './View.svelte'

    export let params: MultiSlugParams
</script>

<div class="view">
    <Sidebar />

    {#if params.slug1 && params.slug2}
        <View {params} />
    {/if}
</div>
