<script lang="ts">
    import debounce from 'lodash/debounce';

    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { userState } from '@/user-home/state/user';
    import type { StaticDataConnectedRealm } from '@/shared/stores/static/types';

    import GroupedCheckbox from '@/shared/components/forms/GroupedCheckboxInput.svelte';
    import NumberInput from '@/shared/components/forms/NumberInput.svelte';

    const crIds: Record<number, boolean> = {};
    const realmNames: Record<string, boolean> = {};
    for (const character of userState.general.characters) {
        crIds[character.realm.connectedRealmId] = true;
        realmNames[character.realm.name] = true;
    }

    let shownRealms: string[] = Object.keys(crIds).filter(
        (crId) => settingsState.value.auctions.ignoredRealms.indexOf(parseInt(crId)) === -1
    );

    const connectedRealms: StaticDataConnectedRealm[] = Object.keys(crIds).map((crId) =>
        wowthingData.static.connectedRealmById.get(parseInt(crId))
    );
    connectedRealms.sort((a, b) => a.displayText.localeCompare(b.displayText));

    $: debouncedUpdateSettings(shownRealms);

    const debouncedUpdateSettings = debounce((shownRealms) => {
        settingsState.value.auctions.ignoredRealms = Object.keys(crIds)
            .filter((crId) => shownRealms.indexOf(crId) === -1)
            .map((crId) => parseInt(crId));
    }, 100);
</script>

<style lang="scss">
</style>

<div class="settings-block">
    <h2>Auctions</h2>

    <div class="setting">
        <NumberInput
            name="auctions_minimumExtraPetsValue"
            label="Minimum buyout"
            minValue={0}
            maxValue={999999}
            bind:value={settingsState.value.auctions.minimumExtraPetsValue}
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
