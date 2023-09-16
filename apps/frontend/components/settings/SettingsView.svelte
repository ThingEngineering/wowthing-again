<script lang="ts">
    import type { SvelteComponent } from 'svelte'

    import { getColumnResizer } from '@/utils/get-column-resizer'

    import Achievements from './sections/SettingsAchievements.svelte'
    import Auctions from './sections/SettingsAuctions.svelte'
    import AuctionsCustom from './sections/SettingsAuctionsCustom.svelte'
    import Account from './sections/SettingsAccount.svelte'
    import Collections from './sections/SettingsCollections.svelte'
    import History from './sections/SettingsHistory.svelte'
    import HomeTable from '@/components/home/HomeTable.svelte'
    import Layout from './sections/SettingsLayout.svelte'
    import LayoutGrouping from './sections/layout/SettingsLayoutGrouping.svelte'
    import Leaderboard from './sections/SettingsLeaderboard.svelte'
    import Lockouts from './sections/SettingsLockouts.svelte'
    import Privacy from './sections/SettingsPrivacy.svelte'
    import Tasks from './sections/SettingsTasks.svelte'
    import Transmog from './sections/SettingsTransmog.svelte'

    import Characters from './sections/characters/SettingsCharacters.svelte'
    import CharactersPin from './sections/characters/SettingsCharactersPin.svelte'
    import CharactersSort from './sections/characters/SettingsCharactersSort.svelte'
    import CharactersToggles from './sections/characters/SettingsCharactersToggles.svelte'

    export let slug1: string
    export let slug2: string

    let slug: string
    $: {
        slug = slug2 ? `${slug1}/${slug2}` : slug1
    }

    const components: Record<string, typeof SvelteComponent> = {
        'account': Account,
        'achievements': Achievements,
        'auctions': Auctions,
        'auctions/custom': AuctionsCustom,
        'collections': Collections,
        'history': History,
        'leaderboard': Leaderboard,
        'privacy': Privacy,
        'transmog': Transmog,
        
        'characters': Characters,
        'characters/pin': CharactersPin,
        'characters/sort': CharactersSort,
        'characters/toggles': CharactersToggles,

        'layout': Layout,
        'layout/grouping': LayoutGrouping,
        'layout/lockouts': Lockouts,
        'layout/tasks': Tasks,
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
</script>

<svelte:window on:resize={debouncedResize} />

<div class="wrapper-column">
    <div class="resizer-view" bind:this={containerElement}>
        <div bind:this={resizeableElement}>
            <div class="thing-container settings-container">
                <svelte:component
                    this={components[slug]}
                />
            </div>
        </div>
    </div>

    {#if slug === 'layout'}
        <HomeTable characterLimit={2} />
    {/if}
</div>
