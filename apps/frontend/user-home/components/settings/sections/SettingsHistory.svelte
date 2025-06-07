<script lang="ts">
    import debounce from 'lodash/debounce';
    import sortBy from 'lodash/sortBy';

    import { Region } from '@/enums/region';
    import { staticStore } from '@/shared/stores/static';
    import { userStore } from '@/stores';
    import { settingsState } from '@/shared/state/settings.svelte';
    import type { StaticDataRealm } from '@/shared/stores/static/types';

    import GroupedCheckbox from '@/shared/components/forms/GroupedCheckboxInput.svelte';

    let realms: StaticDataRealm[] = $derived.by(() =>
        sortBy(
            $userStore.goldHistoryRealms.map((realmId) => $staticStore.realms[realmId]),
            (realm) => [realm.region, realm.name]
        )
    );

    let shownRealms: string[] = $derived.by(() =>
        $userStore.goldHistoryRealms
            .filter((realmId) => settingsState.value.history.hiddenRealms.indexOf(realmId) === -1)
            .map((realmId) => realmId.toString())
    );

    const debouncedUpdateSettings = debounce((shownRealms) => {
        settingsState.value.history.hiddenRealms = realms
            .filter((realm) => shownRealms.indexOf(realm.id.toString()) === -1)
            .map((realm) => realm.id);
    }, 100);

    $effect(() => debouncedUpdateSettings(shownRealms));
</script>

<div class="settings-block">
    <h3>Shown Realms</h3>

    {#each realms as realm (realm.id)}
        <GroupedCheckbox
            name="realm_{realm.id}"
            bind:bindGroup={shownRealms}
            value={realm.id.toString()}
        >
            [{Region[realm.region]}] {realm.name}
        </GroupedCheckbox>
    {/each}
</div>
