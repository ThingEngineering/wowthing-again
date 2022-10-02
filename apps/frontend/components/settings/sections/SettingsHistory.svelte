<script lang="ts">
    import debounce from 'lodash/debounce'
    import sortBy from 'lodash/sortBy'

    import { staticStore, userStore } from '@/stores'
    import { data as settings } from '@/stores/settings'

    import GroupedCheckbox from '@/components/forms/GroupedCheckboxInput.svelte'
    import type { StaticDataRealm } from '@/types/data/static'
    import { Region } from '@/enums'

    let realms: StaticDataRealm[]
    $: {
        realms = sortBy(
                    $userStore.data.goldHistoryRealms
                        .map((realmId) => $staticStore.data.realms[realmId]),
            (realm) => [realm.region, realm.name]
        )
    }   

    let shownRealms: string[] = $userStore.data.goldHistoryRealms
        .filter((realmId) => $settings.history.hiddenRealms.indexOf(realmId) === -1)
        .map((realmId) => realmId.toString())
    
    $: debouncedUpdateSettings(shownRealms)
    const debouncedUpdateSettings = debounce((shownRealms) => {
        $settings.history.hiddenRealms = realms
            .filter((realm) => shownRealms.indexOf(realm.id.toString()) === -1)
            .map((realm) => realm.id)
    }, 100)
</script>

<div class="thing-container settings-container">
    <h2>History</h2>

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
