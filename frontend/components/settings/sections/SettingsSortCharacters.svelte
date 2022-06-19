<script lang="ts">
    import debounce from 'lodash/debounce'
    import filter from 'lodash/filter'

    import { data as settingsData } from '@/stores/settings'
    import type { SettingsChoice } from '@/types'

    import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import MagicLists from '../SettingsMagicLists.svelte'

    const groupByChoices: SettingsChoice[] = [
        {key: 'account', name: 'Account ID'},
        {key: 'enabled', name: 'Account enabled'},
        {key: 'faction', name: 'Faction'},
        {key: 'maxlevel', name: 'Max level'},
        {key: 'pinned', name: 'Pinned'},
    ]

    const sortByChoices: SettingsChoice[] = [
        {key: 'account', name: 'Account'},
        {key: 'enabled', name: 'Active accounts first'},
        {key: 'faction', name: 'Alliance > Horde'},
        {key: '-faction', name: 'Horde > Alliance'},
        {key: 'mplusrating', name: 'Mythic+ Rating'},
        {key: 'name', name: 'Character name'},
        {key: 'realm', name: 'Realm name'},
        {key: 'gold', name: 'Gold'},
        {key: 'itemlevel', name: 'Item level'},
        {key: 'level', name: 'Level'},
    ]

    const groupByActive = $settingsData.general.groupBy.map(
        (f) => filter(groupByChoices, (c) => c.key === f)[0]
    )
    const groupByInactive = filter(groupByChoices, (c) => groupByActive.indexOf(c) < 0)

    const sortByActive = $settingsData.general.sortBy.map(
        (f) => filter(sortByChoices, (c) => c.key === f)[0]
    )
    const sortByInactive = filter(sortByChoices, (c) => sortByActive.indexOf(c) < 0)

    const onGroupByChange = debounce(() => {
        settingsData.update(state => {
            state.general.groupBy = groupByActive.map((c) => c.key)
            return state
        })
    }, 100)

    const onSortByChange = debounce(() => {
        settingsData.update(state => {
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
