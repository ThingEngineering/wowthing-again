<script lang="ts">
    import {afterUpdate} from 'svelte'

    import getSavedRoute from '@/utils/get-saved-route'

    import MythicPlusSidebar from './MythicPlusSidebar.svelte'
    import MythicPlusStats from './MythicPlusStats.svelte'
    import MythicPlusTable from './MythicPlusTable.svelte'

    export let params: { slug: string }

    afterUpdate(() => getSavedRoute('mythic-plus', params.slug))
</script>

<style lang="scss">
    .wrapper {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
    .sub-wrapper {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>

<div class="wrapper">
    <MythicPlusSidebar />
    <div class="sub-wrapper">
        {#if params.slug}
            <MythicPlusTable slug={params.slug} />

            {#if params.slug !== 'this-week'}
                <MythicPlusStats slug={params.slug} />
            {/if}
        {/if}
    </div>
</div>
