<script lang="ts">
    import SettingsCharacters from './sections/SettingsCharacters.svelte'
    import SettingsLayout from './sections/SettingsLayout.svelte'
    import SettingsPrivacy from './sections/SettingsPrivacy.svelte'
    import SettingsTransmog from './sections/SettingsTransmog.svelte'

    export let slug: string

    const components: Record<string, any> = {
        characters: SettingsCharacters,
        layout: SettingsLayout,
        privacy: SettingsPrivacy,
        transmog: SettingsTransmog,
    }
</script>

<svelte:component this={components[slug]} />
