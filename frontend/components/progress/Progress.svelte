<script lang="ts">
    import { afterUpdate } from 'svelte'

    import { userAchievementStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'

    import ProgressSidebar from './ProgressSidebar.svelte'
    import ProgressTable from './ProgressTable.svelte'

    export let params: { slug: string }

    afterUpdate(() => getSavedRoute('progress', params.slug))
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

{#if $userAchievementStore.loaded}
    <div>
        <ProgressSidebar />
        {#if params.slug}
            <ProgressTable slug={params.slug} />
        {/if}
    </div>
{/if}
