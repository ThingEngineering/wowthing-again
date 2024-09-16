<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'

    import Sidebar from './Sidebar.svelte'
    import Table from './Table.svelte'

    export let params: { slug: string }

    afterUpdate(() => getSavedRoute('reputations', params.slug))
</script>

<div class="view">
    <Sidebar />
    {#if params.slug}
        <Table slug={params.slug} />
    {/if}
</div>
