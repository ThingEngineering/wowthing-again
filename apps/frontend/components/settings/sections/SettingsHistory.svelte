<script lang="ts">
    import debounce from 'lodash/debounce'
    import sortBy from 'lodash/sortBy'

    import { settingsStore, userStore } from '@/stores'
    import { staticStore } from '@/stores/static'

    import GroupedCheckbox from '@/shared/forms/GroupedCheckboxInput.svelte'
    import type { StaticDataRealm } from '@/stores/static/types'
    import { Region } from '@/enums/region'

    let realms: StaticDataRealm[]
    $: {
        realms = sortBy(
                    $userStore.goldHistoryRealms
                        .map((realmId) => $staticStore.realms[realmId]),
            (realm) => [realm.region, realm.name]
        )
    }   

    let shownRealms: string[] = $userStore.goldHistoryRealms
        .filter((realmId) => $settingsStore.history.hiddenRealms.indexOf(realmId) === -1)
        .map((realmId) => realmId.toString())
    
    $: debouncedUpdateSettings(shownRealms)
    const debouncedUpdateSettings = debounce((shownRealms) => {
        $settingsStore.history.hiddenRealms = realms
            .filter((realm) => shownRealms.indexOf(realm.id.toString()) === -1)
            .map((realm) => realm.id)
    }, 100)
</script>

<div class="settings-block">
    <h3>Shown Realms</h3>

    {#each realms as realm}
        <GroupedCheckbox
            name="realm_{realm.id}"
            bind:bindGroup={shownRealms}
            value={realm.id.toString()}
        >
            [{Region[realm.region]}] {realm.name}
        </GroupedCheckbox>
    {/each}
</div>
