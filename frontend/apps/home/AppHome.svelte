<script lang="ts">
    import { onMount } from 'svelte'

    import { staticStore, userCollectionStore, userStore } from '@/stores'

    import Routes from './AppHomeRoutes.svelte'
    import Sidebar from './AppHomeSidebar.svelte'

    onMount(async () => await Promise.all([
        staticStore.fetch(),
        userCollectionStore.fetch(),
        userStore.fetch(),
    ]))

    let error: boolean
    let loaded: boolean
    let ready: boolean
    $: {
        error = $staticStore.error || $userCollectionStore.error || $userStore.error
        loaded = $staticStore.loaded && $userCollectionStore.loaded && $userStore.loaded

        if (loaded) {
            userCollectionStore.setup(
                $staticStore.data,
                $userCollectionStore.data,
            )
            ready = true
        }
    }
</script>

<style lang="scss" global>
    @import 'scss/global.scss';
</style>

{#if error}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if !ready}
    <p>L O A D I N G</p>
{:else}
    <Sidebar />
    <Routes />
{/if}
