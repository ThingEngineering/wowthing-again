<script lang="ts">
    import Router from 'svelte-spa-router';

    import type { ParamsSlugsProps } from '@/types/props';

    import Achievements from './sections/SettingsAchievements.svelte';
    import Auctions from './sections/SettingsAuctions.svelte';
    import AuctionsCustom from './sections/SettingsAuctionsCustom.svelte';
    import Account from './sections/SettingsAccount.svelte';
    import Collections from './sections/SettingsCollections.svelte';
    import History from './sections/SettingsHistory.svelte';
    import HomeTable from '@/components/home/HomeTable.svelte';
    import Layout from './sections/SettingsLayout.svelte';
    import LayoutGrouping from './sections/layout/SettingsLayoutGrouping.svelte';
    import Leaderboard from './sections/SettingsLeaderboard.svelte';
    import Privacy from './sections/SettingsPrivacy.svelte';
    import Professions from './sections/SettingsProfessions.svelte';
    import Tags from './sections/SettingsTags.svelte';
    import Tasks from './sections/SettingsTasks.svelte';
    import Transmog from './sections/SettingsTransmog.svelte';
    import View from './sections/views/View.svelte';
    import Views from './sections/views/Views.svelte';

    import Characters from './sections/characters/SettingsCharacters.svelte';
    import CharactersPin from './sections/characters/SettingsCharactersPin.svelte';
    import CharactersToggles from './sections/characters/SettingsCharactersToggles.svelte';

    let { params }: ParamsSlugsProps = $props();

    const routes = {
        '/account': Account,
        '/achievements': Achievements,
        '/auctions/custom': AuctionsCustom,
        '/auctions': Auctions,
        '/collections': Collections,
        '/history': History,
        '/leaderboard': Leaderboard,
        '/privacy': Privacy,
        '/professions': Professions,
        '/tags': Tags,
        '/tasks': Tasks,
        '/transmog': Transmog,

        '/characters/pin': CharactersPin,
        '/characters/toggles': CharactersToggles,
        '/characters': Characters,

        '/layout/grouping': LayoutGrouping,
        '/layout': Layout,

        '/views': Views,
        '/views/:viewId': View,
    };
</script>

<div class="thing-container settings-container">
    <Router prefix="/settings" {routes} />
</div>

{#if params.slug1 === 'layout' && !params.slug2}
    <HomeTable characterLimit={2} />
{/if}
