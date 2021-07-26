<script lang="ts">
    import CurrenciesSidebar from './CurrenciesSidebar.svelte'
    import CurrenciesTable from './CurrenciesTable.svelte'

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
