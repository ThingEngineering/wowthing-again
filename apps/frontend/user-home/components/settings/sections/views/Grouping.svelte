<script lang="ts">
    import debounce from 'lodash/debounce'

    import type { SettingsChoice, SettingsView } from '@/shared/stores/settings/types'

    // import CharacterTable from '@/components/character-table/CharacterTable.svelte'
    import MagicLists from '../../MagicLists.svelte'

    export let view: SettingsView

    const groupByChoices: SettingsChoice[] = [
        {key: 'account', name: 'Account ID'},
        {key: 'enabled', name: 'Account status'},
        {key: 'faction', name: 'Faction'},
        {key: 'guild', name: 'Guild'},
        {key: 'maxlevel', name: 'Max level'},
        {key: 'pinned', name: 'Pinned'},
        {key: 'realm', name: 'Connected realm'},
    ]

    const groupByActive = view.groupBy
        .map((f) => groupByChoices.filter((c) => c.key === f)[0])
    const groupByInactive = groupByChoices.filter((c) => groupByActive.indexOf(c) < 0)

    const onGroupByChange = debounce(() => {
        view.groupBy = groupByActive.map((c) => c.key)
    }, 100)
</script>

<style lang="scss">
    // .new-group {
    //     background: $highlight-background;;
    //     text-align: center;
    // }
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
        key="group-by"
        title="Group Characters By"
        onFunc={onGroupByChange}
        active={groupByActive}
        inactive={groupByInactive}
    />
</div>

<!-- <div class="settings-block">
    <CharacterTable>
        <tr slot="groupHead">
            <td class="new-group" colspan="999">--- NEW GROUP ---</td>
        </tr>

    </CharacterTable>
</div> -->
