<script lang="ts">
    import { afterUpdate, onMount } from 'svelte';

    import { achievementStore, userAchievementStore } from '@/stores';
    import { settingsState } from '@/shared/state/settings.svelte';
    import getSavedRoute from '@/utils/get-saved-route';
    import type { MultiSlugParams } from '@/types';

    import Map from './ZoneMapsMap.svelte';
    import Sidebar from './ZoneMapsSidebar.svelte';

    export let params: MultiSlugParams;

    onMount(
        async () =>
            await Promise.all([
                achievementStore.fetch({ language: settingsState.value.general.language }),
            ]),
    );

    let error: boolean;
    let loaded: boolean;
    let ready: boolean;
    $: {
        error = $achievementStore.error || $userAchievementStore.error;
        loaded = $achievementStore.loaded && $userAchievementStore.loaded;
        ready = !error && loaded;
    }

    afterUpdate(() => {
        if (ready) {
            getSavedRoute('zone-maps', params.slug1, params.slug2);
        }
    });
</script>

{#if !ready}
    L O A D I N G
{:else}
    <Sidebar />
    <Map slug1={params.slug1} slug2={params.slug2} />
{/if}
