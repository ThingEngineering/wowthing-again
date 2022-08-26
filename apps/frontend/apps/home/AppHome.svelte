<script lang="ts">
    import { onMount } from 'svelte'

    import {
        appearanceStore,
        itemStore,
        journalStore,
        manualStore,
        staticStore,
        timeStore,
        userAchievementStore,
        userQuestStore,
        //userStatsStore,
        userStore,
        userTransmogStore,
    } from '@/stores'
    import { journalState, vendorState, zoneMapState } from '@/stores/local-storage'
    import { data as settings } from '@/stores/settings'
    import { userVendorStore } from '@/stores/user-vendors'
    import parseApiTime from '@/utils/parse-api-time'

    import Refresh from './AppHomeRefresh.svelte'
    import Routes from './AppHomeRoutes.svelte'
    import Sidebar from './AppHomeSidebar.svelte'

    onMount(async () => await Promise.all([
        appearanceStore.fetch(),
        itemStore.fetch({ language: $settings.general.language }),
        journalStore.fetch({ language: $settings.general.language }),
        manualStore.fetch({ language: $settings.general.language }),
        staticStore.fetch({ language: $settings.general.language }),
        userAchievementStore.fetch(),
        userQuestStore.fetch(),
        userStore.fetch(),
        userTransmogStore.fetch(),
    ]))

    let error: boolean
    let loaded: boolean
    let ready: boolean
    $: {
        error = $appearanceStore.error
            || $itemStore.error
            || $journalStore.error
            || $manualStore.error
            || $staticStore.error
            || $userAchievementStore.error
            || $userQuestStore.error
            || $userStore.error
            || $userTransmogStore.error

        loaded = $appearanceStore.loaded
            && $itemStore.loaded
            && $journalStore.loaded
            && $manualStore.loaded
            && $staticStore.loaded
            && $userAchievementStore.loaded
            && $userQuestStore.loaded
            && $userStore.loaded
            && $userTransmogStore.loaded

        if (!error && loaded) {
            manualStore.setup(
                $settings,
                $userStore.data,
                $userAchievementStore.data,
                $userQuestStore.data,
                $userTransmogStore.data,
                $zoneMapState,
            )

            userStore.setup(
                $userStore.data,
            )

            userTransmogStore.setup(
                $settings
            )

            userVendorStore.setup(
                $settings,
                $userStore.data,
                $userTransmogStore.data,
                $vendorState
            )

            appearanceStore.setup(
                $appearanceStore.data,
                $userTransmogStore.data
            )

            journalStore.setup(
                $settings,
                $journalStore.data,
                $journalState,
                $manualStore.data,
                $staticStore.data,
                $userStore.data,
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
