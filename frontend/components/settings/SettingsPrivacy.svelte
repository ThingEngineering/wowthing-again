<script lang="ts">
    import {data as settingsData} from '@/stores/settings'

    import Checkbox from '@/components/forms/Checkbox.svelte'

    const accountLink = window.location.href.split('#')[0]
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>Privacy</h2>

    <ul>
        <li>
            <Checkbox name="privacy_public" label="Publicly accessible" bind:value={$settingsData.privacy.public} />
            <p>Is your account publicly viewable via <a href="{accountLink}">your account link</a></p>
        </li>
        <li>
            <Checkbox name="privacy_anonymized" label="Anonymize character/realm names" bind:value={$settingsData.privacy.anonymized} />
            <p>SecretGoose - Honkstrasza</p>
        </li>
        <li>
            <Checkbox name="privacy_showInLeaderboards" label="Show in leaderboards" bind:value={$settingsData.privacy.showInLeaderboards} />
        </li>
    </ul>
</div>
