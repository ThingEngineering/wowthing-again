<script lang="ts">
    import type { SvelteComponent } from 'svelte'

    import SettingsAccount from './sections/SettingsAccount.svelte'
    import SettingsHideCharacters from './sections/SettingsHideCharacters.svelte'
    import SettingsLayout from './sections/SettingsLayout.svelte'
    import SettingsPinCharacters from './sections/SettingsPinCharacters.svelte'
    import SettingsPrivacy from './sections/SettingsPrivacy.svelte'
    import SettingsSortCharacters from './sections/SettingsSortCharacters.svelte'
    import SettingsTransmog from './sections/SettingsTransmog.svelte'

    export let slug: string

    const components: Record<string, typeof SvelteComponent> = {
        account: SettingsAccount,
        layout: SettingsLayout,
        privacy: SettingsPrivacy,
        transmog: SettingsTransmog,
        'hide-characters': SettingsHideCharacters,
        'pin-characters': SettingsPinCharacters,
        'sort-characters': SettingsSortCharacters,
    }
</script>

<svelte:component this={components[slug]} />
