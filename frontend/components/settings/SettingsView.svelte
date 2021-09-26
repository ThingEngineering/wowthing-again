<script lang="ts">
    import type { SvelteComponent } from 'svelte'

    import SettingsAccount from './sections/SettingsAccount.svelte'
    import SettingsHideCharacters from './sections/SettingsHideCharacters.svelte'
    import SettingsLayout from './sections/SettingsLayout.svelte'
    import SettingsPrivacy from './sections/SettingsPrivacy.svelte'
    import SettingsSortCharacters from './sections/SettingsSortCharacters.svelte'
    import SettingsTransmog from './sections/SettingsTransmog.svelte'

    export let slug: string

    const components: Record<string, typeof SvelteComponent> = {
        account: SettingsAccount,
        'hide-characters': SettingsHideCharacters,
        layout: SettingsLayout,
        privacy: SettingsPrivacy,
        'sort-characters': SettingsSortCharacters,
        transmog: SettingsTransmog,
    }
</script>

<svelte:component this={components[slug]} />
