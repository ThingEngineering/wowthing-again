<script lang="ts">
    import { onMount } from 'svelte'

    import {
        appearanceStore,
        dbStore,
        itemStore,
        journalStore,
        manualStore,
        settingsStore,
        timeStore,
        userAchievementStore,
        userQuestStore,
        userStore,
        userTransmogStore,
    } from '@/stores'
    import { staticStore } from '@/stores/static'
    import parseApiTime from '@/utils/parse-api-time'

    import NewNav from './AppHomeNewNav.svelte'
    import Refresh from './AppHomeRefresh.svelte'
    import Routes from './AppHomeRoutes.svelte'
    import Sidebar from './AppHomeSidebar.svelte'

    onMount(async () => await Promise.all([
        appearanceStore.fetch(),
        dbStore.fetch({ language: $settingsStore.general.language }),
        itemStore.fetch({ language: $settingsStore.general.language }),
        journalStore.fetch({ language: $settingsStore.general.language }),
        manualStore.fetch({ language: $settingsStore.general.language }),
        staticStore.fetch({ language: $settingsStore.general.language }),
        userAchievementStore.fetch(),
        userQuestStore.fetch(),
        userStore.fetch(),
        userTransmogStore.fetch(),
    ]))

    $: {
        const navTarget = document.querySelector('#app-nav')
        navTarget.replaceChildren()
        if ($settingsStore.layout.newNavigation) {
            new NewNav({ target: navTarget })
        }
    }

    let error: boolean
    let loaded: boolean
    let ready: boolean
    $: {
        error = $appearanceStore.error
            || $dbStore.error
            || $itemStore.error
            || $journalStore.error
            || $manualStore.error
            || $staticStore.error
            || $userAchievementStore.error
            || $userQuestStore.error
            || $userStore.error
            || $userTransmogStore.error

        loaded = $appearanceStore.loaded
            && $dbStore.loaded
            && $itemStore.loaded
            && $journalStore.loaded
            && $manualStore.loaded
            && $staticStore.loaded
            && $userAchievementStore.loaded
            && $userQuestStore.loaded
            && $userStore.loaded
            && $userTransmogStore.loaded

        if (!error && loaded) {
            staticStore.setup(
                $settingsStore
            )

            appearanceStore.setup(
                $staticStore
            )

            userStore.setup(
                $settingsStore,
                $userStore,
            )

            userTransmogStore.setup(
                $settingsStore,
                $userAchievementStore
            )

            itemStore.setup(
                $manualStore,
            )

            ready = true
        }
    }
    
    $: {
        if (ready && !$userStore.public && $userStore.lastApiCheck) {
            const parsedTime = parseApiTime($userStore.lastApiCheck)
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
    }

    $: {
        const headerLinks = document.getElementById('nav-left')
            .getElementsByClassName('header-title')
        ;(headerLinks[0] as HTMLElement).style.display = $settingsStore.leaderboard.enabled
            ? 'inline-block'
            : 'none'
    }
</script>

{#if error}
    <p>KABOOM! Something has gone horribly wrong, try reloading the page?</p>
{:else if !ready}
    <p>L O A D I N G</p>
{:else}
    {#if !$settingsStore.layout.newNavigation}
        <Sidebar />
    {/if}
    <Routes />
{/if}
