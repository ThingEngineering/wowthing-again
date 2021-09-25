<script lang="ts">
    import SettingsLayout from './sections/SettingsLayout.svelte'
    import SettingsPrivacy from './sections/SettingsPrivacy.svelte'
    import SettingsTransmog from './sections/SettingsTransmog.svelte'

    export let slug: string

    const components = {
        layout: SettingsLayout,
        privacy: SettingsPrivacy,
        transmog: SettingsTransmog,
    }
</script>

<svelte:component this={components[slug]} />
