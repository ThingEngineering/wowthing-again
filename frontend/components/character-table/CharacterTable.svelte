<script lang="ts">
    import filter from 'lodash/filter'
    import groupBy from 'lodash/groupBy'
    import keys from 'lodash/keys'
    import map from 'lodash/map'
    import sortBy from 'lodash/sortBy'
    import toPairs from 'lodash/toPairs'

    import { data as settingsData } from '@/stores/settings'
    import { userStore } from '@/stores'
    import type { Character } from '@/types'
    import getCharacterGroupFunc from '@/utils/get-character-group-func'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'

    import CharacterRow from './CharacterTableRow.svelte'

    export let filterFunc: (char: Character) => boolean = undefined
    export let groupFunc: (char: Character) => string = undefined
    export let sortFunc: (char: Character) => string = undefined

    let characters: Character[]
    let groups: Character[][]

    $: {
        if (!filterFunc) {
            filterFunc = (char) => char.level >= $settingsData.general.minimumLevel
        }
        if (!groupFunc) {
            groupFunc = getCharacterGroupFunc()
        }
        if (!sortFunc) {
            sortFunc = getCharacterSortFunc()
        }

        characters = filter($userStore.data.characters, filterFunc)
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
</style>

<div class="thing-container">
    <table class="table table-striped character-table">
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
