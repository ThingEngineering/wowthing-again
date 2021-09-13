<script lang="ts">
    import {afterUpdate} from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'

    import CurrenciesSidebar from './CurrenciesSidebar.svelte'
    import CurrenciesTable from './CurrenciesTable.svelte'

    export let params: { slug: string }

    afterUpdate(() => getSavedRoute('currencies', params.slug))
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
