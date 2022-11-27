 <script lang="ts">
    import debounce from 'lodash/debounce'
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import groupBy from 'lodash/groupBy'
    import some from 'lodash/some'
    import sortBy from 'lodash/sortBy'

    import { staticStore, userStore } from '@/stores'
    import {data as settingsData} from '@/stores/settings'
    import { Region } from '@/enums'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import type { Character } from '@/types'

    import GroupedCheckbox from '@/components/forms/GroupedCheckboxInput.svelte'

    const allCharacterIds: string[] = $userStore.data.characters.map((char) => char.id.toString())
    
    let hiddenCharacters: string[] = $userStore.data.characters
        .filter((char) => $settingsData.characters.hiddenCharacters.indexOf(char.id) >= 0)
        .map((char) => char.id.toString())
    
    let ignoredCharacters: string[] = $userStore.data.characters
        .filter((char) => $settingsData.characters.ignoredCharacters.indexOf(char.id) >= 0)
        .map((char) => char.id.toString())

    let realms: [string, Character[]][]
    $: {
        const sortFunc = getCharacterSortFunc($settingsData, $staticStore.data)
        const grouped: Record<string, Character[]> = groupBy(
            $userStore.data.characters,
            (c) => `${Region[c.realm.region]}|${c.realm.name}`
        )
        for (const realmName in grouped) {
            grouped[realmName] = sortBy(grouped[realmName], sortFunc)
        }

        realms = Object.entries(grouped)
        realms.sort()
    }

    $: debouncedUpdateSettings(hiddenCharacters, ignoredCharacters)

    const debouncedUpdateSettings = debounce((hiddenChars: string[], ignoredChars: string[]) => {
        $settingsData.characters.hiddenCharacters = allCharacterIds
            .filter((charId) => hiddenChars.indexOf(charId) >= 0)
            .map((charId) => parseInt(charId))

        $settingsData.characters.ignoredCharacters = allCharacterIds
            .filter((charId) => ignoredChars.indexOf(charId) >= 0)
            .map((charId) => parseInt(charId))
    }, 100)

    const realmClick = function(this: HTMLElement): void {
        const type = this.innerText === '[hide all]' ? 'hide' : 'ignore'

        const tr = this.parentElement.parentElement
        const realmString = `${tr.children[0].innerHTML.trim().substring(1, 3)}|${tr.children[1].innerHTML.trim()}`

        const realmCharacters: string[] = find(
            realms,
            ([realm]) => realm === realmString
        )[1].map((char) => char.id.toString())

        const anyMissing: boolean = some(
            realmCharacters,
            (charId) => (type === 'hide' ? hiddenCharacters : ignoredCharacters).indexOf(charId) === -1
        )
        const toChange: string[] = filter(
            realmCharacters,
            (charId) => !anyMissing || (anyMissing && (type === 'hide' ? hiddenCharacters : ignoredCharacters).indexOf(charId) === -1)
        )

        for (const charId of toChange) {
            setTimeout(() => document.getElementById(`input-${type}_character_${charId}`).click())
        }
    }
</script>

<style lang="scss">
    .realm {
        h3 {
            cursor: pointer;
            font-size: 1.1rem;
            margin-top: 0.5rem;

            span {
                color: #00ccff;
                margin-left: 1rem;
            }
        }

        :global(fieldset) {
            display: inline-block;
            margin: 0;
            white-space: nowrap;
            width: 9.0rem;
        }
    }
    table {
        margin-top: 1rem;
    }
    td,
    th {
        white-space: nowrap;
    }
    th {
        padding-bottom: 0.25rem;
        padding-top: 0.25rem;
    }
    .realm {
        @include cell-width($width-name-max);

        text-align: left;
    }
    .level {
        @include cell-width(2rem);

        text-align: right;
    }
    .name {
        @include cell-width($width-name-max);

        text-align: left;
    }
    .ignore,
    .hide {
        @include cell-width(6rem);
        
        cursor: pointer;
        text-align: center;

        :global(fieldset[data-state="false"]) {
            background: inherit;
        }
        :global(fieldset[data-state="true"]) {
            background: rgba(255, 0, 0, 0.2);
        }
        :global(fieldset.disabled) {
            color: #888;
        }
    }
</style>

<div class="thing-container settings-container">
    <h2>Character Toggles</h2>

    <ul>
        <li>"Ignore" will stop including this character in most things, basically marking as inactive.</li>
        <li>"Hide" will completely hide this character.</li>
    </ul>

    {#each realms as [realm, characters]}
        {@const realmParts = realm.split('|')}
        <table class="table table-striped">
            <thead>
                <tr>
                    <th class="level">[{realmParts[0]}]</th>
                    <th class="name">{realmParts[1]}</th>
                    <th class="ignore">
                        <span
                            on:click={realmClick}
                            on:keypress={realmClick}
                        >[ignore all]</span>
                    </th>
                    <th class="hide">
                        <span
                            on:click={realmClick}
                            on:keypress={realmClick}
                        >[hide all]</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each characters as character}
                    {@const idString = character.id.toString()}
                    <tr>
                        <td class="level">
                            <code>{character.level}</code>
                        </td>
                        <td class="name class-{character.classId}">{character.name}</td>
                        <td class="ignore">
                            <GroupedCheckbox
                                name="ignore_character_{character.id}"
                                bind:bindGroup={ignoredCharacters}
                                disabled={hiddenCharacters.indexOf(idString) >= 0}
                                value={idString}
                            >Ignore</GroupedCheckbox>
                        </td>
                        <td class="hide">
                            <GroupedCheckbox
                                name="hide_character_{character.id}"
                                bind:bindGroup={hiddenCharacters}
                                value={idString}
                            >Hide</GroupedCheckbox>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/each}
</div>
