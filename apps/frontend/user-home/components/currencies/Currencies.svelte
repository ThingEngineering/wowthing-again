<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Sidebar from './Sidebar.svelte'
    import Table from './Table.svelte'

    export let params: MultiSlugParams

    afterUpdate(() => getSavedRoute('currencies', params.slug1, params.slug2))
</script>

<div class="view">
    <Sidebar />
    <Table {params} />
</div>
