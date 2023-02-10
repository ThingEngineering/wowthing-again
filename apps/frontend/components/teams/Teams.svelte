<script lang="ts">
    import { afterUpdate, onMount } from 'svelte'

    import { userTeamStore } from '@/stores'
    import getSavedRoute from '@/utils/get-saved-route'

    import Sidebar from './TeamsSidebar.svelte'

    export let params: {
        slug: string
    }

    let error: boolean
    let loaded: boolean
    let ready: boolean
    $: {
        error = $userTeamStore.error
        loaded =$userTeamStore.loaded
        ready = (!error && loaded)
    }

    onMount(async () => await Promise.all([
        userTeamStore.fetch(),
    ]))

    afterUpdate(() => getSavedRoute('teams', params.slug))
</script>

<div class="view">
    {#if error}
        <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
    {:else if !ready}
        <p>L O A D I N G</p>
    {:else}
        <Sidebar />
    {/if}
</div>
