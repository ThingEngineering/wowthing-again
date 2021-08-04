<script lang="ts">
    import ProgressSidebar from './ProgressSidebar.svelte'
    import ProgressTable from './ProgressTable.svelte'

    export let params: { slug: string }
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

<div>
    <ProgressSidebar />
    {#if params.slug}
        <ProgressTable slug={params.slug} />
    {/if}
</div>
