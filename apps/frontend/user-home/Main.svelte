<script lang="ts">
    import { mount, onDestroy, onMount } from 'svelte';

    import { Region } from '@/enums/region';
    import { wowthingData } from '@/shared/stores/data';
    import { settingsStore } from '@/shared/stores/settings';
    import { staticStore } from '@/shared/stores/static';
    import { timeStore } from '@/shared/stores/time';
    import {
        itemStore,
        journalStore,
        manualStore,
        userAchievementStore,
        userQuestStore,
        userStore,
    } from '@/stores';
    import { worldQuestStore } from '@/user-home/components/world-quests/store';
    import parseApiTime from '@/utils/parse-api-time';

    import { userUpdateHubStore } from './signalr/user-update-hub-store';

    import NewNav from './NewNav.svelte';
    import Refresh from './Refresh.svelte';
    import Routes from './Routes.svelte';
    import Sidebar from './Sidebar.svelte';

    onMount(
        async () =>
            await Promise.all([
                itemStore.fetch({ language: $settingsStore.general.language }),
                journalStore.fetch({ language: $settingsStore.general.language }),
                manualStore.fetch({ language: $settingsStore.general.language }),
                staticStore.fetch({ language: $settingsStore.general.language }),
                userAchievementStore.fetch(),
                userQuestStore.fetch(),
                userStore.fetch(),
                worldQuestStore.fetch(Region.US),
                worldQuestStore.fetch(Region.EU),
                wowthingData.fetch(),
            ]),
    );

    onDestroy(() => userUpdateHubStore.disconnect());

    let error: boolean;
    let loaded: boolean;
    let ready: boolean;
    $: {
        error =
            $itemStore.error ||
            $journalStore.error ||
            $manualStore.error ||
            $staticStore.error ||
            $userAchievementStore.error ||
            $userQuestStore.error ||
            $userStore.error;

        loaded =
            $itemStore.loaded &&
            $journalStore.loaded &&
            $manualStore.loaded &&
            $staticStore.loaded &&
            $userAchievementStore.loaded &&
            $userQuestStore.loaded &&
            $userStore.loaded &&
            wowthingData.loaded;

        if (!error && loaded) {
            staticStore.setup($settingsStore, $itemStore);

            userStore.setup($settingsStore, $userStore, $userAchievementStore);

            userQuestStore.setup($timeStore);

            if (!$userStore.public) {
                userUpdateHubStore.connect();
            }

            ready = true;
        }
    }

    $: {
        if (ready) {
            const navTarget = document.querySelector('#app-nav');
            navTarget.replaceChildren();
            if ($settingsStore.layout.newNavigation) {
                mount(NewNav, { target: navTarget });
            }
        }
    }

    $: {
        if (ready && !$userStore.public && $userStore.lastApiCheck) {
            const parsedTime = parseApiTime($userStore.lastApiCheck);
            const diff = $timeStore.diff(parsedTime).toMillis();
            // Add the refresh button if lastApiCheck is more than 24 hours ago
            if (diff > 24 * 60 * 60 * 1000) {
                const navCenter = document.getElementById('nav-center');
                navCenter.replaceChildren();
                mount(Refresh, {
                    target: navCenter,
                    props: {},
                });
            }
        }
    }

    $: {
        const headerLinks = document
            .getElementById('nav-left')
            .getElementsByClassName('header-title');
        (headerLinks[0] as HTMLElement).style.display = $settingsStore.leaderboard.enabled
            ? 'inline-block'
            : 'none';
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
