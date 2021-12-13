<script lang="ts">
    import { onMount } from 'svelte'

    import {
        journalStore,
        staticStore,
        transmogStore,
        userStore,
        userTransmogStore,
    } from '@/stores'
    import { journalState } from '@/stores/local-storage'
    import { data as settings } from '@/stores/settings'

    import Routes from './AppHomeRoutes.svelte'
    import Sidebar from './AppHomeSidebar.svelte'

    onMount(async () => await Promise.all([
        staticStore.fetch(undefined, $settings.general.language),
        journalStore.fetch(undefined, $settings.general.language),
        transmogStore.fetch(),
        userStore.fetch(),
        userTransmogStore.fetch(),
    ]))

    let error: boolean
    let loaded: boolean
    let ready: boolean
    $: {
        error = $staticStore.error
            || $journalStore.error
            || $transmogStore.error
            || $userStore.error
            || $userTransmogStore.error

        loaded = $staticStore.loaded
            && $journalStore.loaded
            && $transmogStore.loaded
            && $userStore.loaded
            && $userTransmogStore.loaded

        if (loaded) {
            userStore.setup(
                $staticStore.data,
                $userStore.data,
            )

            userTransmogStore.setup(
                $settings,
                $transmogStore.data,
                $userTransmogStore.data,
            )

            journalStore.setup(
                $journalStore.data,
                $journalState,
                $settings,
                $userTransmogStore.data
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
