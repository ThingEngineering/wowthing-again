<script lang="ts">
    import type { SvelteComponent } from 'svelte'

    import SettingsAuctions from './sections/SettingsAuctions.svelte'
    import SettingsAccount from './sections/SettingsAccount.svelte'
    import SettingsHideCharacters from './sections/SettingsHideCharacters.svelte'
    import SettingsLayout from './sections/SettingsLayout.svelte'
    import SettingsLockouts from './sections/SettingsLockouts.svelte'
    import SettingsPinCharacters from './sections/SettingsPinCharacters.svelte'
    import SettingsPrivacy from './sections/SettingsPrivacy.svelte'
    import SettingsSortCharacters from './sections/SettingsSortCharacters.svelte'
    import SettingsTransmog from './sections/SettingsTransmog.svelte'

    export let slug1: string
    export let slug2: string

    let slug: string
    $: {
        slug = slug2 ? `${slug1}/${slug2}` : slug1
    }

    const components: Record<string, typeof SvelteComponent> = {
        'account': SettingsAccount,
        'auctions': SettingsAuctions,
        'layout': SettingsLayout,
        'layout/lockouts': SettingsLockouts,
        'privacy': SettingsPrivacy,
        'transmog': SettingsTransmog,
        'hide-characters': SettingsHideCharacters,
        'pin-characters': SettingsPinCharacters,
        'sort-characters': SettingsSortCharacters,
    }
</script>

<svelte:component
    this={components[slug]}
/>
