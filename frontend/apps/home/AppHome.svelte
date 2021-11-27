<script lang="ts">
    import { onMount } from 'svelte'

    import {
        staticStore,
        transmogStore,
        userCollectionStore,
        userStore,
        userTransmogStore,
    } from '@/stores'
    import { data as settings } from '@/stores/settings'

    import Routes from './AppHomeRoutes.svelte'
    import Sidebar from './AppHomeSidebar.svelte'

    onMount(async () => await Promise.all([
        staticStore.fetch(undefined, $settings.general.language),
        transmogStore.fetch(),
        userCollectionStore.fetch(),
        userStore.fetch(),
        userTransmogStore.fetch(),
    ]))

    let error: boolean
    let loaded: boolean
    let ready: boolean
    $: {
        error = $staticStore.error
            || $transmogStore.error
            || $userCollectionStore.error
            || $userStore.error
            || $userTransmogStore.error

        loaded = $staticStore.loaded
            && $transmogStore.loaded
            && $userCollectionStore.loaded
            && $userStore.loaded
            && $userTransmogStore.loaded

        if (loaded) {
            userCollectionStore.setup(
                $staticStore.data,
                $userCollectionStore.data,
            )

            userTransmogStore.setup(
                $settings,
                $transmogStore.data,
                $userTransmogStore.data,
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
