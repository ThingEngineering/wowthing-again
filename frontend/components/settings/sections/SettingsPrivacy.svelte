<script lang="ts">
    import {data as settingsData} from '@/stores/settings'

    import Checkbox from '@/components/forms/CheckboxInput.svelte'

    const accountLink = window.location.href.split('#')[0]
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>Privacy</h2>

    <div class="setting">
        <Checkbox
            name="privacy_public"
            bind:value={$settingsData.privacy.public}
        >Publicly accessible</Checkbox>
        <p>
            Make your account publicly viewable via <a href="{accountLink}">your account link</a>
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_anonymized"
            bind:value={$settingsData.privacy.anonymized}
        >Anonymize character/realm names</Checkbox>
        <p>
            Use "SecretGoose" for every character name and "Honkstrasza" for every realm name
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_share_currencies"
            bind:value={$settingsData.privacy.publicCurrencies}
        >Public Currencies</Checkbox>
        <p>
            Allow visitors to see your Currencies data
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_share_lockouts"
            bind:value={$settingsData.privacy.publicLockouts}
        >Public Lockouts</Checkbox>
        <p>Allow visitors to see your Lockouts data</p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_share_mythic_plus"
            bind:value={$settingsData.privacy.publicMythicPlus}
        >Public Mythic+</Checkbox>
        <p>
            Allow visitors to see your Mythic+ data
        </p>
    </div>

    <div class="setting">
        <Checkbox
            name="privacy_share_transmog"
            bind:value={$settingsData.privacy.publicTransmog}
        >Public Transmog</Checkbox>
        <p>
            Allow visitors to see your Transmog data
        </p>
    </div>
</div>
