<script lang="ts">
    import {afterUpdate} from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './CurrenciesSidebar.svelte'
    import Table from './CurrenciesTable.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('currencies', params.slug1, params.slug2))
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

<div>
    <Sidebar />
    <Table {params} />
</div>
