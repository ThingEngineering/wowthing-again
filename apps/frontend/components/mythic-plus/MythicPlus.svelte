<script lang="ts">
    import { afterUpdate } from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'

    import MythicPlusSidebar from './MythicPlusSidebar.svelte'
    import MythicPlusStats from './MythicPlusStats.svelte'
    import MythicPlusTable from './MythicPlusTable.svelte'

    export let params: { slug: string }

    afterUpdate(() => getSavedRoute('mythic-plus', params.slug))
</script>

<style lang="scss">
    .sub-wrapper {
        flex-direction: column;
    }
</style>

<div class="view">
    <MythicPlusSidebar />
    <div class="view sub-wrapper">
        {#if params.slug}
            <MythicPlusTable slug={params.slug} />

            {#if params.slug !== 'this-week'}
                <MythicPlusStats slug={params.slug} />
            {/if}
        {/if}
    </div>
</div>
