<script lang="ts">
    import debounce from 'lodash/debounce'

    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types'

    import MagicLists from '../../MagicLists.svelte'

    export let view: SettingsView

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

    const sortByActive = view.sortBy.map(
        (f) => sortByChoices.filter((c) => c.key === f)[0]
    )
    const sortByInactive = sortByChoices.filter((c) => sortByActive.indexOf(c) < 0)

    const onSortByChange = debounce(() => {
        view.sortBy = sortByActive.map((c) => c.key)
    }, 100)
</script>

<style lang="scss">
    .settings-block {
        --magic-min-height: 11.4rem;
        --magic-max-height: 11.4rem;

        :global(.columns h3) {
            border-top: none;
            padding-top: 0;
        }
    }
</style>

<div class="settings-block">
    <MagicLists
        key="sort-by"
        title="Sort Characters By"
        onFunc={onSortByChange}
        active={sortByActive}
        inactive={sortByInactive}
    />
</div>
