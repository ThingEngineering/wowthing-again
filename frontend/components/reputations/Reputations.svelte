<script lang="ts">
    import ReputationsSidebar from './ReputationsSidebar.svelte'
    import ReputationsTable from './ReputationsTable.svelte'

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
    <ReputationsSidebar />
    <ReputationsTable slug={params.slug} />
</div>
