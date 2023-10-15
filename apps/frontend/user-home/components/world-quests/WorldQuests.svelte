<script lang="ts">
    import type { MultiSlugParams } from '@/types/params'

    import Map from './Map.svelte'
    import Sidebar from './Sidebar.svelte'

    export let params: MultiSlugParams
</script>

<style lang="scss">

</style>

<div class="view">
    <Sidebar />

    {#if params.slug1}
        <Map slug={params.slug1} />
    {/if}
</div>
