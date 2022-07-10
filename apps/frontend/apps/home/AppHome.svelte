<script lang="ts">
    import { onMount } from 'svelte'

    import {
        journalStore,
        staticStore,
        timeStore,
        transmogStore,
        userAchievementStore,
        userQuestStore,
        userStore,
        userTransmogStore,
    } from '@/stores'
    import { journalState, vendorState } from '@/stores/local-storage'
    import { data as settings } from '@/stores/settings'
    import { userVendorStore } from '@/stores/user-vendors'
    import parseApiTime from '@/utils/parse-api-time'

    import Refresh from './AppHomeRefresh.svelte'
    import Routes from './AppHomeRoutes.svelte'
    import Sidebar from './AppHomeSidebar.svelte'

    onMount(async () => await Promise.all([
        staticStore.fetch(undefined, $settings.general.language),
        journalStore.fetch(undefined, $settings.general.language),
        transmogStore.fetch(),
        userAchievementStore.fetch(),
        userQuestStore.fetch(),
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
            //|| $userAchievementStore.error
            || $userQuestStore.error
            || $userStore.error
            || $userTransmogStore.error

        loaded = $staticStore.loaded
            && $journalStore.loaded
            && $transmogStore.loaded
            //&& $userAchievementStore.loaded
            && $userQuestStore.loaded
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

            userVendorStore.setup(
                $settings,
                $staticStore.data,
                $userStore.data,
                $userTransmogStore.data,
                $vendorState
            )

            journalStore.setup(
                $journalStore.data,
                $journalState,
                $settings,
                $staticStore.data,
                $userTransmogStore.data
            )

            if (!$userStore.data.public && $userStore.data.lastApiCheck) {
                const parsedTime = parseApiTime($userStore.data.lastApiCheck)
                const diff = $timeStore.diff(parsedTime).toMillis()
                // Add the refresh button if lastApiCheck is more than 24 hours ago
                if (diff > (24 * 60 * 60 * 1000)) {
                    const navCenter = document.getElementById('nav-center')
                    navCenter.replaceChildren()
                    new Refresh({
                        target: navCenter,
                        props: {},
                    })
                }
            }

            ready = true
        }
    }
</script>

{#if error}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if !ready}
    <p>L O A D I N G</p>
{:else}
    <Sidebar />
    <Routes />
{/if}
