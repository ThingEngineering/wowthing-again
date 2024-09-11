<script lang="ts">
    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types'

    import MagicLists from '../../MagicLists.svelte'

    export let view: SettingsView

    const sortByChoices: SettingsChoice[] = [
        {id: 'account', name: 'Account'},
        {id: 'enabled', name: 'Account status'},
        {id: 'armor', name: 'Armor: Cloth > Plate'},
        {id: '-armor', name: 'Armor: Plate > Cloth'},
        {id: 'class', name: 'Class name'},
        {id: 'faction', name: 'Faction: :alliance: > :horde:'},
        {id: '-faction', name: 'Faction: :horde: > :alliance:'},
        {id: 'guild', name: 'Guild name'},
        {id: 'mplusrating', name: 'Mythic+ Rating'},
        {id: 'name', name: 'Character name'},
        {id: 'realm', name: 'Realm name'},
        {id: 'gold', name: 'Gold'},
        {id: 'itemlevel', name: 'Item level'},
        {id: 'level', name: 'Level'},
    ]
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
        choices={sortByChoices}
        bind:activeStringIds={view.sortBy}
    />
</div>
