<script lang="ts">
    import type { MultiSlugParams } from '@/types'

    import Options from './Options.svelte'
    import Sidebar from './Sidebar.svelte'
    import View from './View.svelte'

    export let params: MultiSlugParams
</script>

<div class="view">
    <Sidebar />

    {#if params.slug1 && params.slug2}
        <div class="column-wrapper">
            <Options />
            <View {params} />
        </div>
    {/if}
</div>
