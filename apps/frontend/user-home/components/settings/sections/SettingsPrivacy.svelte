<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte';

    const accountLink = window.location.href.split('#')[0];
</script>

<style lang="scss">
</style>

<div class="settings-block">
    <h2>Privacy</h2>

    <div class="setting">
        <Checkbox name="privacy_public" bind:value={settingsState.value.privacy.public}
            >Publicly accessible</Checkbox
        >
        <p>
            Make your account publicly viewable via <a href={accountLink}>your account link</a>
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_anonymized"
            disabled={!settingsState.value.privacy.public}
            bind:value={settingsState.value.privacy.anonymized}>Anonymize names</Checkbox
        >
        <p>Use "SecretGoose" for every character name and "Honkstrasza" for every realm name</p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_public_accounts"
            disabled={!settingsState.value.privacy.public}
            bind:value={settingsState.value.privacy.publicAccounts}>Public Accounts</Checkbox
        >
        <p>Allow visitors to see account tags on characters</p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_public_currencies"
            disabled={!settingsState.value.privacy.public}
            bind:value={settingsState.value.privacy.publicCurrencies}>Public Currencies</Checkbox
        >
        <p>Allow visitors to see your Currencies data</p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_public_lockouts"
            disabled={!settingsState.value.privacy.public}
            bind:value={settingsState.value.privacy.publicLockouts}>Public Lockouts</Checkbox
        >
        <p>Allow visitors to see your Lockouts data</p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_public_mythic_plus"
            disabled={!settingsState.value.privacy.public}
            bind:value={settingsState.value.privacy.publicMythicPlus}>Public Mythic+</Checkbox
        >
        <p>Allow visitors to see your Mythic+ data</p>
    </div>
</div>
