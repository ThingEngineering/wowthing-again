<script lang="ts">
    import {afterUpdate, onMount} from 'svelte'

    import { journalStore, userTransmogStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import getSavedRoute from '@/utils/get-saved-route'
    import type { MultiSlugParams } from '@/types'

    import Instance from './JournalInstance.svelte'
    import Sidebar from './JournalSidebar.svelte'

    export let params: MultiSlugParams

    let error: boolean
    let loaded: boolean
    let ready: boolean
    $: {
        error = $journalStore.error
        loaded = $journalStore.loaded
    }

    $: {
        if (loaded) {
            journalStore.setup(
                $journalStore.data,
                $settingsData,
                $userTransmogStore.data
            )
            ready = true
        }
    }

    onMount(async () => await journalStore.fetch())

    afterUpdate(() => {
        if (loaded) {
            getSavedRoute('journal', params.slug1, params.slug2)
        }
    })
</script>

{#if error}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if !ready}
    <p>L O A D I N G</p>
{:else}
    <Sidebar />
    <Instance
        slug1={params.slug1}
        slug2={params.slug2}
    />
{/if}
