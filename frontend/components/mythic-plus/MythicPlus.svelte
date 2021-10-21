<script lang="ts">
    import {afterUpdate} from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'

    import MythicPlusSidebar from './MythicPlusSidebar.svelte'
    import MythicPlusTable from './MythicPlusTable.svelte'

    export let params: { slug: string }

    afterUpdate(() => getSavedRoute('mythic-plus', params.slug))
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

<div>
    <MythicPlusSidebar />
    {#if params.slug}
        <MythicPlusTable slug={params.slug} />
    {/if}
</div>
