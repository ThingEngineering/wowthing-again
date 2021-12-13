<script lang="ts">
    import { onMount } from 'svelte'

    import { userHistoryStore } from '@/stores'

    import Gold from './HistoryGold.svelte'
    import Sidebar from './HistorySidebar.svelte'

    export let params: { slug: string }

    onMount(async () => {
        await userHistoryStore.fetch()
    })
</script>

<Sidebar />
{#if !$userHistoryStore.loaded}
    L O A D I N G
{:else}
    {#if params.slug === 'gold'}
        <Gold />
    {/if}
{/if}
