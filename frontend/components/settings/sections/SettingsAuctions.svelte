<script lang="ts">
    import debounce from 'lodash/debounce'

    import { staticStore, userStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import type { Character, StaticDataConnectedRealm } from '@/types'

    import GroupedCheckbox from '@/components/forms/GroupedCheckboxInput.svelte'

    const crIds: Record<number, boolean> = {}
    const realmNames: Record<string, boolean> = {}
    for (const character: Character of $userStore.data.characters) {
        crIds[character.realm.connectedRealmId] = true
        realmNames[character.realm.name] = true
    }

    let shownRealms: string[] = Object.keys(crIds)
        .filter((crId) => $settingsData.auctions.ignoredRealms.indexOf(parseInt(crId)) === -1)

    const connectedRealms: [string, string, string][] = []
    for (const crId in crIds) {
        const connectedRealm: StaticDataConnectedRealm = $staticStore.data.connectedRealms[crId]

        const names: string[] = []
        let extra = 0
        for (const realmName of connectedRealm.realmNames) {
            if (realmNames[realmName]) {
                names.push(realmName)
            }
            else {
                extra++
            }
        }

        let nameString = names.join(' / ')
        if (extra > 0) {
            nameString += ` (+${extra})`
        }

        connectedRealms.push([
            nameString,
            crId,
            connectedRealm.displayText,
        ])
    }

    connectedRealms.sort()

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

    <h3>Ignored Realms</h3>

    {#each connectedRealms as [text, crId, tooltip]}
        <GroupedCheckbox
            name="realm_{crId}"
            bind:bindGroup={shownRealms}
            value={crId}
        >
            {text}
        </GroupedCheckbox>
    {/each}
</div>
