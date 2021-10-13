<script lang="ts">
    import { onMount } from 'svelte'

    import { staticStore, userCollectionStore, userStore } from '@/stores'

    import Routes from './AppHomeRoutes.svelte'
    import Sidebar from './AppHomeSidebar.svelte'

    let error: boolean
    let loaded: boolean
    $: {
        error = $staticStore.error || $userCollectionStore.error || $userStore.error
        loaded = $staticStore.loaded && $userCollectionStore.loaded && $userStore.loaded
    }

    onMount(async () => await Promise.all([
        staticStore.fetch(),
        userCollectionStore.fetch(),
        userStore.fetch(),
    ]))
</script>

<style lang="scss" global>
    @import 'scss/global.scss';
</style>

{#if error}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if !loaded}
    <p>L O A D I N G</p>
{:else}
    <Sidebar />
    <Routes />
{/if}
