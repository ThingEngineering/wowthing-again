<script lang="ts">
    import groupBy from 'lodash/groupBy'
    import sortBy from 'lodash/sortBy'
    import { onDestroy, onMount } from 'svelte'

    import { lazyStore, timeStore, userStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { homeState, newNavState } from '@/stores/local-storage'
    import { settingsStore } from '@/shared/stores/settings'
    import { useCharacterFilter } from '@/utils/characters'
    import { setElementStyleById } from '@/utils/dom'
    import { homeSort } from '@/utils/home'
    import getCharacterGroupFunc from '@/utils/get-character-group-func'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import type { Character } from '@/types'

    import CharacterRow from './CharacterTableRow.svelte'

    export let characterLimit = 0
    export let isHome = false
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
            sortFunc = getCharacterSortFunc($settingsStore, $staticStore)
        }

        groupFunc = getCharacterGroupFunc($settingsStore)
    }

    $: {
        characters = $userStore.characters.filter(
            (c) => $settingsStore.characters.hiddenCharacters.indexOf(c.id) === -1 &&
                (!skipIgnored || $settingsStore.characters.ignoredCharacters.indexOf(c.id) === -1) &&
                (
                    $settingsStore.characters.hideDisabledAccounts === false ||
                    $userStore.accounts?.[c.accountId]?.enabled !== false
                )
        )

        characters = characters.filter((char) => useCharacterFilter(
            $lazyStore, filterFunc, char, $newNavState.characterFilter))

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

        const groupKeys = Object.keys(grouped)
        groupKeys.sort()

        const pairs: [string, Character[]][] = []
        for (let keyIndex = 0; keyIndex < groupKeys.length; keyIndex++) {
            const key = groupKeys[keyIndex]
            const sortKey = `${$settingsStore.activeView}|${keyIndex}`
            const keySort = isHome && $homeState.groupSort[sortKey]
                ? getCharacterSortFunc(
                    $settingsStore,
                    $staticStore,
                    (char) => homeSort($lazyStore, $timeStore, $homeState.groupSort[sortKey], char))
                : sortFunc
            pairs.push([
                key,
                sortBy(grouped[key], keySort)
            ])
        }

        pairs.sort()
        groups = pairs.map(([, group]) => group)
        if (groups.length === 1 && groups[0].length === 0) {
            groups = []
        }
    }

    onMount(() => setElementStyleById('character-filter', 'display', 'flex'))
    onDestroy(() => setElementStyleById('character-filter', 'display', 'none'))

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

<div>
    <slot name="preTable" />

    <table
        class="table table-striped character-table"
        style="--padding: {paddingMap[$settingsStore.layout.padding] || 1};"
    >
        <slot name="head" />
        <tbody>
            {#each groups as group, groupIndex}
                <slot name="groupHead" {group} {groupIndex} />

                {#each group as character, characterIndex (character.id)}
                    <CharacterRow
                        {character}
                        {isHome}
                        last={characterIndex === (group.length - 1)}
                    >
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
        <slot name="foot" />
    </table>
</div>
