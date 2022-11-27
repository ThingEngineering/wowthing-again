<script lang="ts">
    import filter from 'lodash/filter'
    import groupBy from 'lodash/groupBy'
    import map from 'lodash/map'
    import sortBy from 'lodash/sortBy'

    import { data as settingsData } from '@/stores/settings'
    import { staticStore, userStore } from '@/stores'
    import type {Character} from '@/types'
    import getCharacterGroupFunc from '@/utils/get-character-group-func'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'

    import CharacterRow from './CharacterTableRow.svelte'

    export let characterLimit = 0
    export let skipGrouping = false
    export let skipIgnored = false
    export let filterFunc: (char: Character) => boolean = undefined
    export let sortFunc: (char: Character) => string = undefined

    const noSortFunc = !sortFunc

    let characters: Character[]
    let groups: Character[][]
    let groupFunc: (char: Character) => string

    $: {
        if (!filterFunc) {
            filterFunc = () => true
        }
        if (noSortFunc) {
            sortFunc = getCharacterSortFunc($settingsData, $staticStore.data)
        }

        groupFunc = getCharacterGroupFunc($settingsData)
    }

    $: {
        characters = filter(
            $userStore.data.characters,
            (c) => $settingsData.characters.hiddenCharacters.indexOf(c.id) === -1 &&
                (!skipIgnored || $settingsData.characters.ignoredCharacters.indexOf(c.id) === -1) &&
                (
                    $settingsData.characters.hideDisabledAccounts === false ||
                    $userStore.data.accounts?.[c.accountId]?.enabled !== false
                )
        )
        characters = filter(characters, filterFunc)

        if (characterLimit > 0) {
            characters = characters.slice(0, characterLimit)
        }

        let grouped: Record<string, Character[]>
        if (skipGrouping) {
            grouped = {
                all: characters,
            }
        }
        else {
            grouped = groupBy(characters, groupFunc)
        }

        const pairs: [string, Character[]][] = []
        for (const key of Object.keys(grouped)) {
            pairs.push([key, sortBy(grouped[key], sortFunc)])
        }

        pairs.sort()
        groups = map(pairs, (pair) => pair[1])
    }

    const paddingMap: Record<string, number> = {
        small: 1,
        medium: 2,
        large: 3,
    }
</script>

<style lang="scss">
    .uhoh {
        @include cell-width(50rem);

        background: $horde-background;
        padding-top: 0.5rem;
        white-space: normal;
    }
</style>

<div class="thing-container">
    <slot name="preTable" />

    <table
        class="table table-striped character-table"
        style="--padding: {paddingMap[$settingsData.layout.padding] || 1};"
    >
        <slot name="head" />
        <tbody>
            {#each groups as group, groupIndex}
                <slot name="groupHead" {group} {groupIndex} />

                {#each group as character, characterIndex (character.id)}
                    <CharacterRow {character} last={characterIndex === (group.length - 1)}>
                        <slot slot="rowExtra" name="rowExtra" {character} />
                    </CharacterRow>
                {/each}
            {:else}
                <slot name="emptyRow">
                    <tr>
                        <td class="uhoh">
                            It looks like you have no valid characters. If this is a new account,
                            check again in a minute or so. If you still have no characters, try:
                            
                            <ul>
                                <li>Log out and back in on this site to trigger an account update.</li>
                                <li>If that didn't work, reset WoWthing's permissions on Battle.net:
                                    go to your <a href="https://account.battle.net/connections#connected-accounts">Battle.net Connections page</a>,
                                    find "WoWthing Live" and click <code>X REMOVE</code>. Then log out and back in
                                    on this site. DO NOT UNTICK THE BOX WHEN BATTLE.NET ASKS!</li>
                                <li>If that still didn't work, drop by <a href="https://discord.gg/4UkTT5y">the Discord</a> and
                                    ask for help.</li>
                            </ul>
                        </td>
                    </tr>
                </slot>
            {/each}
        </tbody>
    </table>
</div>
