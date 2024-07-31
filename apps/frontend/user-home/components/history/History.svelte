<script lang="ts">
    import { afterUpdate, onMount } from 'svelte'

    import { userHistoryStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'

    import Gold from './Gold.svelte'
    import Sidebar from './Sidebar.svelte'

    export let params: { slug: string }

    onMount(async () => {
        await userHistoryStore.fetch()
    })

    afterUpdate(() => getSavedRoute('history', params.slug))
</script>

<Sidebar />
{#if !$userHistoryStore.loaded}
    L O A D I N G
{:else}
    {#if params.slug === 'gold'}
        <Gold />
    {/if}
{/if}
