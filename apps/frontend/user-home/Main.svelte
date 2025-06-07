<script lang="ts">
    import { mount, onDestroy, onMount } from 'svelte';

    import { Region } from '@/enums/region';
    import { sharedState } from '@/shared/state/shared.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { staticStore } from '@/shared/stores/static';
    import { timeStore } from '@/shared/stores/time';
    import { journalStore, userAchievementStore, userQuestStore, userStore } from '@/stores';
    import { worldQuestStore } from '@/user-home/components/world-quests/store';
    import parseApiTime from '@/utils/parse-api-time';
    import type { Settings } from '@/shared/stores/settings/types/settings';

    import { userUpdateHubStore } from './signalr/user-update-hub-store';

    import NewNav from './NewNav.svelte';
    import Refresh from './Refresh.svelte';
    import Routes from './Routes.svelte';
    import Sidebar from './Sidebar.svelte';

    let ready = $state(false);

    onMount(async () => {
        sharedState.public = userStore.dataUrl.includes('/public-');

        await Promise.all([
            journalStore.fetch({ language: settingsState.value.general.language }),
            staticStore.fetch({ language: settingsState.value.general.language }),
            wowthingData.fetch(settingsState.value.general.language),
        ]);

        await Promise.all([
            userAchievementStore.fetch(),
            userQuestStore.fetch(),
            userStore.fetch(),
            worldQuestStore.fetch(Region.US),
            worldQuestStore.fetch(Region.EU),
        ]);

        staticStore.setup();
        userStore.setup(settingsState.value, $userStore);
        // FIX: should likely be derived
        userQuestStore.setup($timeStore);

        // mounting the new nav conditionally is annoying
        const navTarget = document.querySelector('#app-nav');
        navTarget.replaceChildren();
        if (settingsState.value.layout.newNavigation) {
            mount(NewNav, { target: navTarget });
        }

        if (!sharedState.public) {
            // Fix account settings
            const accounts = $state.snapshot(settingsState.value.accounts);
            if (Object.keys(accounts || {}).length === 0) {
                const newAccounts: Settings['accounts'] = {};
                for (const account of Object.values($userStore.accounts)) {
                    newAccounts[account.id] = {
                        enabled: account.enabled !== undefined ? account.enabled : true,
                        tag: account.tag || '',
                    };
                }
                settingsState.value.accounts = newAccounts;
            }

            // Signal/R for notifications
            userUpdateHubStore.connect();

            // Add the refresh button if lastApiCheck is more than 24 hours ago
            if ($userStore.lastApiCheck) {
                const parsedTime = parseApiTime($userStore.lastApiCheck);
                const diff = $timeStore.diff(parsedTime).toMillis();
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

        ready = true;
    });

    onDestroy(() => userUpdateHubStore.disconnect());

    $effect(() => {
        const headerLinks = document
            .getElementById('nav-left')
            .getElementsByClassName('header-title');
        (headerLinks[0] as HTMLElement).style.display = settingsState.value.leaderboard.enabled
            ? 'inline-block'
            : 'none';
    });
</script>

{#if !ready}
    <p>L O A D I N G</p>
{:else}
    {#if !settingsState.value.layout.newNavigation}
        <Sidebar />
    {/if}
    <Routes />
{/if}
