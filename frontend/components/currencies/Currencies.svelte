<script lang="ts">
    import CurrenciesSidebar from './Sidebar.svelte'
    import CurrenciesTable from './Table.svelte'

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
    <CurrenciesSidebar />
    <CurrenciesTable slug={params.slug} />
</div>
