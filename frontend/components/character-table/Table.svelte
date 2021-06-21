<script lang="ts">
    import filter from 'lodash/filter'
    import groupBy from 'lodash/groupBy'
    import keys from 'lodash/keys'
    import map from 'lodash/map'
    import sortBy from 'lodash/sortBy'
    import toPairs from 'lodash/toPairs'
    import { setContext } from 'svelte'

    import { data as userData } from '@/stores/user'
    import type {Character} from '@/types'
    import getCharacterGroupFunc from '@/utils/get-character-group-func'
    //import getCharacterSortFunc from '@/utils/get-character-sort-func'

    import CharacterRow from './Row.svelte'

    export let endSpacer = true
    export let filterFunc: (char: Character) => boolean = () => true
    export let groupFunc: (char: Character) => string = getCharacterGroupFunc()
    export let sortFunc: (char: Character) => number = undefined

    setContext('endSpacer', endSpacer)

    let characters: Character[]
    let groups: Character[][]

    $: {
        characters = filter($userData.characters, filterFunc)
        const grouped = groupBy(characters, groupFunc)
        for (const key of keys(grouped)) {
            grouped[key] = sortBy(grouped[key], sortFunc)
        }

        const pairs = toPairs(grouped)
        pairs.sort()

        groups = map(pairs, (pair) => pair[1])
    }
</script>

<style lang="scss">
    table {
        background: $thing-background;
        border-radius: $border-radius;
        table-layout: fixed;

        & :global(thead > tr > th) {
            border-bottom: 1px solid $border-color;
            border-top: 1px solid $border-color;
            font-weight: 600;
            position: sticky;
            top: 0;
        }
        & :global(thead > tr > th:first-child) {
            border-left: 1px solid $border-color;
            border-top-left-radius: $border-radius;
        }
        & :global(thead > tr > th:last-child) {
            border-right: 1px solid $border-color;
            border-top-right-radius: $border-radius;
        }

        & :global(tbody > tr > td) {
            white-space: nowrap;
        }
        & :global(tbody > tr > td:first-child) {
            border-left: 1px solid $border-color;
        }
        & :global(tbody > tr > td:last-child) {
            border-right: 1px solid $border-color;
        }
        & :global(tbody:first-child > tr:first-child > td) {
            border-top: 1px solid $border-color;
        }
        & :global(tbody:first-child > tr:first-child > td:first-child) {
            border-top-left-radius: $border-radius;
        }
        & :global(tbody:first-child > tr:first-child > td:last-child) {
            border-top-right-radius: $border-radius;
        }
        & :global(tbody > tr.last-of-group > td:first-child) {
            border-bottom-left-radius: $border-radius;
        }
        & :global(tbody > tr.last-of-group > td:last-child) {
            border-bottom-right-radius: $border-radius;
        }
    }
</style>

<div class="thing-container">
    <table class="table table-striped">
        <slot name="head" />
        <tbody>
            {#each groups as group, groupIndex}
                <slot name="groupHead" {group} {groupIndex} />

                {#each group as character, characterIndex (character.id)}
                    <CharacterRow {character} last={characterIndex === (group.length - 1)}>
                        <slot slot="rowExtra" name="rowExtra" {character} />
                    </CharacterRow>
                {/each}
            {/each}
        </tbody>
    </table>
</div>
