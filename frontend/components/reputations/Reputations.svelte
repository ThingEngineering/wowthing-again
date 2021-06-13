<script lang="ts">
    import ReputationSidebar from './Sidebar.svelte'
    import ReputationTable from './Table.svelte'

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
    <ReputationSidebar />
    <ReputationTable slug={params.slug} />
</div>
