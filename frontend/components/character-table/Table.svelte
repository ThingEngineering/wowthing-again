<script lang="ts">
    import filter from 'lodash/filter'
    import groupBy from 'lodash/groupBy'
    import keys from 'lodash/keys'
    import map from 'lodash/map'
    import sortBy from 'lodash/sortBy'
    import sumBy from 'lodash/sumBy'
    import toPairs from 'lodash/toPairs'
    import { setContext } from 'svelte'

    import { data as settings } from '@/stores/settings'
    import { data as userData } from '@/stores/user'
    import type {Character} from '@/types'
    import getCharacterGroupFunc from '@/utils/get-character-group-func'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'

    import CharacterRow from './Row.svelte'

    export let extraSpan = 0
    export let endSpacer = true
    export let filterFunc: (char: Character) => boolean = () => true
    export let groupFunc: (char: Character) => string = getCharacterGroupFunc()
    export let sortFunc: (char: Character) => number = undefined

    setContext('endSpacer', endSpacer)

    let characters: Character[]
    let groups: Character[][]
    $: {
        console.time('reactive')
        characters = filter($userData.characters, filterFunc)
        const grouped = groupBy(characters, groupFunc)
        for (const key of keys(grouped)) {
            grouped[key] = sortBy(grouped[key], sortFunc)
        }

        const pairs = toPairs(grouped)
        pairs.sort()

        groups = map(pairs, (pair) => pair[1])
        console.log(groups)
        console.timeEnd('reactive')
    }

    const span =
        2 +
        sumBy(
            [
                $settings.general.showRaceIcon,
                $settings.general.showClassIcon,
                $settings.general.showSpecIcon,
                $settings.general.showRealm,
            ],
            (setting) => Number(setting),
        )
</script>

<style lang="scss">
    table {
        background: $thing-background;
        border-collapse: collapse;
        border-radius: $border-radius;
        table-layout: fixed;

        & :global(colgroup) {
            border-left: 1px solid $border-color;
        }
        & :global(colgroup:nth-child(even)) {
            background: darken($thing-background, 3%);
        }

        & :global(thead th) {
            border-bottom: 1px solid $border-color;
            position: sticky;
            top: 0;
        }
        & :global(tbody td) {
            white-space: nowrap;
        }
        & :global(tbody tr:first-child td:first-child) {
            border-top-left-radius: $border-radius;
        }
        & :global(tbody tr:first-child td:last-child) {
            border-top-right-radius: $border-radius;
        }
        & :global(tbody tr:last-child td:first-child) {
            border-bottom-left-radius: $border-radius;
        }
        & :global(tbody tr:last-child td:last-child) {
            border-bottom-right-radius: $border-radius;
        }
    }
</style>

<div class="thing-container">
    <table class="table-striped">
        <colgroup span={span + extraSpan}></colgroup>
        <slot name="head" />
        <tbody>
            {#each groups as group, groupIndex}
                <slot name="groupHead" {group} {groupIndex} />

                {#each group as character (character.id)}
                    <CharacterRow {character}>
                        <slot slot="rowExtra" name="rowExtra" {character} />
                    </CharacterRow>
                {/each}
            {/each}
        </tbody>
    </table>
</div>
