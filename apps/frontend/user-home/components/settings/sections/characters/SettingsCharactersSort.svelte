<script lang="ts">
    import debounce from 'lodash/debounce'

    import { settingsStore } from '@/shared/stores/settings'
    import type { SettingsChoice } from '@/shared/stores/settings/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import MagicLists from '../../MagicLists.svelte'

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
        {key: 'guild', name: 'Guild name'},
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
    .new-group {
        background: $highlight-background;;
        text-align: center;
    }
    .settings-block {
        :global(.columns h3) {
            border-top: none;
            padding-top: 0;
        }
    }
</style>

<div class="settings-block">
    <h2>Sort Characters</h2>

    <p>
        Grouping happens before sorting and may give unexpected results!
    </p>

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

<div class="settings-block">
    <CharacterTable>
        <tr slot="groupHead">
            <td class="new-group" colspan="999">--- NEW GROUP ---</td>
        </tr>

    </CharacterTable>
</div>
