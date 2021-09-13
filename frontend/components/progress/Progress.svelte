<script lang="ts">
    import { afterUpdate, onMount } from 'svelte'

    import { userQuestStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'

    import ProgressSidebar from './ProgressSidebar.svelte'
    import ProgressTable from './ProgressTable.svelte'

    export let params: { slug: string }

    let loaded: boolean
    $: {
        loaded = $userQuestStore.loaded
    }

    onMount(async () => await userQuestStore.fetch())

    afterUpdate(() => getSavedRoute('progress', params.slug))
</script>

<style lang="scss">
    div {
        align-items: flex-start;
        display: flex;
        width: 100%;
    }
</style>

{#if !loaded}
    L O A D I N G
{:else}
    <div>
        <ProgressSidebar />
        {#if params.slug}
            <ProgressTable slug={params.slug} />
        {/if}
    </div>
{/if}
