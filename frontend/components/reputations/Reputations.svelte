<script lang="ts">
    import {afterUpdate} from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'

    import ReputationsSidebar from './ReputationsSidebar.svelte'
    import ReputationsTable from './ReputationsTable.svelte'

    export let params: { slug: string }

    afterUpdate(() => getSavedRoute('reputations', params.slug))
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
    {#if params.slug}
        <ReputationsTable slug={params.slug} />
    {/if}
</div>
