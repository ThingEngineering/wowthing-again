<script lang="ts">
    import {data as settingsData} from '@/stores/settings'

    import CheckboxImport from '@/components/forms/CheckboxInput.svelte'

    const accountLink = window.location.href.split('#')[0]
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>Privacy</h2>

    <CheckboxImport name="privacy_public" label="Publicly accessible" bind:value={$settingsData.privacy.public}>
        <p>Is your account publicly viewable via <a href="{accountLink}">your account link</a></p>
    </CheckboxImport>

    <CheckboxImport name="privacy_anonymized" label="Anonymize character/realm names" bind:value={$settingsData.privacy.anonymized}>
        <p>SecretGoose - Honkstrasza</p>
    </CheckboxImport>

    <CheckboxImport name="privacy_showInLeaderboards" label="Show in leaderboards" bind:value={$settingsData.privacy.showInLeaderboards} />
</div>
