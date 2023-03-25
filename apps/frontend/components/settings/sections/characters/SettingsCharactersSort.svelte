<script lang="ts">
    import debounce from 'lodash/debounce'

    import { settingsStore } from '@/stores'
    import type { SettingsChoice } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import MagicLists from '../../SettingsMagicLists.svelte'

    const groupByChoices: SettingsChoice[] = [
        {key: 'account', name: 'Account ID'},
        {key: 'enabled', name: 'Account status'},
        {key: 'faction', name: 'Faction'},
        {key: 'maxlevel', name: 'Max level'},
        {key: 'pinned', name: 'Pinned'},
        {key: 'realm', name: 'Connected realm'},
    ]

    const sortByChoices: SettingsChoice[] = [
        {key: 'account', name: 'Account'},
        {key: 'enabled', name: 'Account status'},
        {key: 'armor', name: 'Armor: Cloth > Plate'},
        {key: '-armor', name: 'Armor: Plate > Cloth'},
        {key: 'class', name: 'Class name'},
        {key: 'faction', name: 'Faction: :alliance: > :horde:'},
        {key: '-faction', name: 'Faction: :horde: > :alliance:'},
        {key: 'mplusrating', name: 'Mythic+ Rating'},
        {key: 'name', name: 'Character name'},
        {key: 'realm', name: 'Realm name'},
        {key: 'gold', name: 'Gold'},
        {key: 'itemlevel', name: 'Item level'},
        {key: 'level', name: 'Level'},
    ]

    const groupByActive = $settingsStore.general.groupBy.map(
        (f) => groupByChoices.filter((c) => c.key === f)[0]
    )
    const groupByInactive = groupByChoices.filter((c) => groupByActive.indexOf(c) < 0)

    const sortByActive = $settingsStore.general.sortBy.map(
        (f) => sortByChoices.filter((c) => c.key === f)[0]
    )
    const sortByInactive = sortByChoices.filter((c) => sortByActive.indexOf(c) < 0)

    const onGroupByChange = debounce(() => {
        settingsStore.update(state => {
            state.general.groupBy = groupByActive.map((c) => c.key)
            return state
        })
    }, 100)

    const onSortByChange = debounce(() => {
        settingsStore.update(state => {
            state.general.sortBy = sortByActive.map((c) => c.key)
            return state
        })
    }, 100)
</script>

<style lang="scss">
    .wrapper {
        display: flex;
        gap: 0.5rem;
    }
    .new-group {
        background: $highlight-background;;
        text-align: center;
    }
</style>

<div class="thing-container settings-container">
    <h2>Sort Characters</h2>

    <p>
        Drag items between the two lists on the left to control the way that characters
        are grouped - this happens before sorting! Drag items between the two lists on
        the right to control the way that characters are sorted.
    </p>

    <div class="wrapper">
        <MagicLists
            key="group-by"
            title="Group By"
            onFunc={onGroupByChange}
            active={groupByActive}
            inactive={groupByInactive}
        />

        <MagicLists
            key="sort-by"
            title="Sort By"
            onFunc={onSortByChange}
            active={sortByActive}
            inactive={sortByInactive}
        />
    </div>

    <CharacterTable>
        <tr slot="groupHead">
            <td class="new-group" colspan="999">--- NEW GROUP ---</td>
        </tr>

    </CharacterTable>
</div>
