<script lang="ts">
    import debounce from 'lodash/debounce'

    import { staticStore, userStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import type { StaticDataConnectedRealm } from '@/types/data/static'

    import GroupedCheckbox from '@/components/forms/GroupedCheckboxInput.svelte'
    import NumberInput from '@/components/forms/NumberInput.svelte'

    const crIds: Record<number, boolean> = {}
    const realmNames: Record<string, boolean> = {}
    for (const character of $userStore.data.characters) {
        crIds[character.realm.connectedRealmId] = true
        realmNames[character.realm.name] = true
    }

    let shownRealms: string[] = Object.keys(crIds)
        .filter((crId) => $settingsData.auctions.ignoredRealms.indexOf(parseInt(crId)) === -1)

    const connectedRealms: StaticDataConnectedRealm[] = Object.keys(crIds)
        .map((crId) => $staticStore.data.connectedRealms[parseInt(crId)])
    connectedRealms.sort((a, b) => a.displayText.localeCompare(b.displayText))

    $: debouncedUpdateSettings(shownRealms)

    const debouncedUpdateSettings = debounce((shownRealms) => {
        $settingsData.auctions.ignoredRealms = Object.keys(crIds)
            .filter((crId) => shownRealms.indexOf(crId) === -1)
            .map((crId) => parseInt(crId))
    }, 100)
</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>Auctions</h2>

    <div class="setting">
        <NumberInput
            name="auctions_minimumExtraPetsValue"
            label="Minimum buyout"
            minValue={0}
            maxValue={999999}
            bind:value={$settingsData.auctions.minimumExtraPetsValue}
        />
        <p>Minimum buyout price (in gold) to include an auction in Extra Pets.</p>
    </div>

    <h3>Ignored Realms</h3>

    {#each connectedRealms as connectedRealm}
        <GroupedCheckbox
            name="realm_{connectedRealm.id}"
            bind:bindGroup={shownRealms}
            value={connectedRealm.id.toString()}
        >
            {connectedRealm.displayText}
        </GroupedCheckbox>
    {/each}
</div>
