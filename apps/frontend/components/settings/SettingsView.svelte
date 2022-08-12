<script lang="ts">
    import type { SvelteComponent } from 'svelte'

    import Auctions from './sections/SettingsAuctions.svelte'
    import Account from './sections/SettingsAccount.svelte'
    import HideCharacters from './sections/SettingsHideCharacters.svelte'
    import History from './sections/SettingsHistory.svelte'
    import Layout from './sections/SettingsLayout.svelte'
    import Lockouts from './sections/SettingsLockouts.svelte'
    import PinCharacters from './sections/SettingsPinCharacters.svelte'
    import Privacy from './sections/SettingsPrivacy.svelte'
    import SortCharacters from './sections/SettingsSortCharacters.svelte'
    import Tasks from './sections/SettingsTasks.svelte'
    import Transmog from './sections/SettingsTransmog.svelte'

    export let slug1: string
    export let slug2: string

    let slug: string
    $: {
        slug = slug2 ? `${slug1}/${slug2}` : slug1
    }

    const components: Record<string, typeof SvelteComponent> = {
        'account': Account,
        'auctions': Auctions,
        'history': History,
        'layout': Layout,
        'layout/lockouts': Lockouts,
        'layout/tasks': Tasks,
        'privacy': Privacy,
        'transmog': Transmog,
        'hide-characters': HideCharacters,
        'pin-characters': PinCharacters,
        'sort-characters': SortCharacters,
    }
</script>

<svelte:component
    this={components[slug]}
/>
