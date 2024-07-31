<script lang="ts">
    import { settingsStore } from '@/shared/stores/settings'

    import Checkbox from '@/shared/components/forms/CheckboxInput.svelte'

    const accountLink = window.location.href.split('#')[0]
</script>

<style lang="scss">
</style>

<div class="settings-block">
    <h2>Privacy</h2>

    <div class="setting">
        <Checkbox
            name="privacy_public"
            bind:value={$settingsStore.privacy.public}
        >Publicly accessible</Checkbox>
        <p>
            Make your account publicly viewable via <a href="{accountLink}">your account link</a>
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_anonymized"
            disabled={!$settingsStore.privacy.public}
            bind:value={$settingsStore.privacy.anonymized}
        >Anonymize names</Checkbox>
        <p>
            Use "SecretGoose" for every character name and "Honkstrasza" for every realm name
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_public_accounts"
            disabled={!$settingsStore.privacy.public}
            bind:value={$settingsStore.privacy.publicAccounts}
        >Public Accounts</Checkbox>
        <p>
            Allow visitors to see account tags on characters
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_public_currencies"
            disabled={!$settingsStore.privacy.public}
            bind:value={$settingsStore.privacy.publicCurrencies}
        >Public Currencies</Checkbox>
        <p>
            Allow visitors to see your Currencies data
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_public_lockouts"
            disabled={!$settingsStore.privacy.public}
            bind:value={$settingsStore.privacy.publicLockouts}
        >Public Lockouts</Checkbox>
        <p>Allow visitors to see your Lockouts data</p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_public_mythic_plus"
            disabled={!$settingsStore.privacy.public}
            bind:value={$settingsStore.privacy.publicMythicPlus}
        >Public Mythic+</Checkbox>
        <p>
            Allow visitors to see your Mythic+ data
        </p>
    </div>
</div>
