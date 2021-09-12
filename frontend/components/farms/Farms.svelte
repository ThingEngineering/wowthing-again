<script lang="ts">
    import {onMount} from 'svelte'

    import {farmStore, userStore} from '@/stores'
    import type {MultiSlugParams} from '@/types'

    import Map from './FarmsMap.svelte'
    import Sidebar from './FarmsSidebar.svelte'

    export let params: MultiSlugParams

    let loaded: boolean
    $: {
        loaded = $farmStore.loaded && $userStore.loaded
    }

    onMount(async () => await Promise.all([
        farmStore.fetch(),
        userStore.fetch(),
    ]))
</script>

{#if !loaded}
    L O A D I N G
{:else}
    <Sidebar />
    <Map slug1={params.slug1} slug2={params.slug2} />
{/if}
