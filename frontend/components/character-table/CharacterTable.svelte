<script lang="ts">
    import filter from 'lodash/filter'
    import groupBy from 'lodash/groupBy'
    import keys from 'lodash/keys'
    import map from 'lodash/map'
    import sortBy from 'lodash/sortBy'
    import toPairs from 'lodash/toPairs'

    import { data as settingsData } from '@/stores/settings'
    import { userStore } from '@/stores'
    import type {Character} from '@/types'
    import getCharacterGroupFunc from '@/utils/get-character-group-func'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'

    import CharacterRow from './CharacterTableRow.svelte'

    export let characterLimit = 0
    export let filterFunc: (char: Character) => boolean = undefined
    export let sortFunc: (char: Character) => string = undefined

    const noSortFunc = !sortFunc

    let characters: Character[]
    let groups: Character[][]
    let groupFunc: (char: Character) => string

    $: {
        if (!filterFunc) {
            filterFunc = (char) => char.level >= $settingsData.general.minimumLevel
        }
        if (noSortFunc) {
            sortFunc = getCharacterSortFunc()
        }

        groupFunc = getCharacterGroupFunc()
    }

    $: {
        characters = filter(
            $userStore.data.characters,
            (c) => $settingsData.characters.hiddenCharacters.indexOf(c.id) === -1
        )
        characters = filter(characters, filterFunc)

        if (characterLimit > 0) {
            characters = characters.slice(0, characterLimit)
        }

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
    <slot name="preTable" />

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
