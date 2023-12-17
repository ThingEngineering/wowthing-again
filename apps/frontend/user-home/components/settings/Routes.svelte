<script lang="ts">
    import { afterUpdate } from 'svelte'
    import Router from 'svelte-spa-router'

    import { getColumnResizer } from '@/utils/get-column-resizer'
    import type { MultiSlugParams } from '@/types'

    import Achievements from './sections/SettingsAchievements.svelte'
    import Auctions from './sections/SettingsAuctions.svelte'
    import AuctionsCustom from './sections/SettingsAuctionsCustom.svelte'
    import Account from './sections/SettingsAccount.svelte'
    import Collections from './sections/SettingsCollections.svelte'
    import History from './sections/SettingsHistory.svelte'
    import HomeTable from '@/components/home/HomeTable.svelte'
    import Layout from './sections/SettingsLayout.svelte'
    import LayoutGrouping from './sections/layout/SettingsLayoutGrouping.svelte'
    import LayoutViews from './sections/layout/SettingsLayoutViews.svelte'
    import Leaderboard from './sections/SettingsLeaderboard.svelte'
    import Lockouts from './sections/SettingsLockouts.svelte'
    import Privacy from './sections/SettingsPrivacy.svelte'
    import Professions from './sections/SettingsProfessions.svelte'
    import Tasks from './sections/SettingsTasks.svelte'
    import Transmog from './sections/SettingsTransmog.svelte'

    import Characters from './sections/characters/SettingsCharacters.svelte'
    import CharactersPin from './sections/characters/SettingsCharactersPin.svelte'
    import CharactersSort from './sections/characters/SettingsCharactersSort.svelte'
    import CharactersToggles from './sections/characters/SettingsCharactersToggles.svelte'

    export let params: MultiSlugParams

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
        '/transmog': Transmog,
        
        '/characters/pin': CharactersPin,
        '/characters/sort': CharactersSort,
        '/characters/toggles': CharactersToggles,
        '/characters': Characters,

        '/layout/grouping': LayoutGrouping,
        '/layout/lockouts': Lockouts,
        '/layout/tasks': Tasks,
        '/layout/views': LayoutViews,
        '/layout': Layout,
    }

    let containerElement: HTMLElement
    let resizeableElement: HTMLElement
    let debouncedResize: () => void
    $: {
        if (resizeableElement) {
            debouncedResize = getColumnResizer(
                containerElement,
                resizeableElement,
                'settings-block',
                {
                    columnCount: '--column-count',
                    gap: 30,
                    padding: '2rem'
                }
            )
            debouncedResize()
        }
        else {
            debouncedResize = null
        }
    }
    
    afterUpdate(() => debouncedResize?.())
</script>

<svelte:window on:resize={debouncedResize} />

<div class="wrapper-column">
    <div class="resizer-view" bind:this={containerElement}>
        <div bind:this={resizeableElement}>
            <div class="thing-container settings-container">
                <Router
                    prefix={'/settings'}
                    {routes}
                />
            </div>
        </div>
    </div>

    {#if params.slug1 === 'layout' && !params.slug2}
        <HomeTable characterLimit={2} />
    {/if}
</div>
