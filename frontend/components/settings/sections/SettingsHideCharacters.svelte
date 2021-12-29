<script lang="ts">
    import debounce from 'lodash/debounce'
    import filter from 'lodash/filter'
    import find from 'lodash/find'
    import groupBy from 'lodash/groupBy'
    import some from 'lodash/some'
    import sortBy from 'lodash/sortBy'

    import { userStore } from '@/stores'
    import {data as settingsData} from '@/stores/settings'
    import { Region } from '@/types/enums'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import type { Character } from '@/types'

    import GroupedCheckbox from '@/components/forms/GroupedCheckboxInput.svelte'

    const allCharacterIds: string[] = $userStore.data.characters.map((char) => char.id.toString())
    let shownCharacters: string[] = $userStore.data.characters
        .filter((char) => $settingsData.characters.hiddenCharacters.indexOf(char.id) === -1)
        .map((char) => char.id.toString())

    let realms: [string, Character[]][]
    $: {
        const sortFunc = getCharacterSortFunc($settingsData)
        const grouped: Record<string, Character[]> = groupBy($userStore.data.characters, (c) => `[${Region[c.realm.region]}] ${c.realm.name}`)
        for (const realmName in grouped) {
            grouped[realmName] = sortBy(grouped[realmName], sortFunc)
        }

        realms = Object.entries(grouped)
        realms.sort()
    }

    $: debouncedUpdateSettings(shownCharacters)

    const debouncedUpdateSettings = debounce((shownChars) => {
        $settingsData.characters.hiddenCharacters = allCharacterIds
            .filter((charId) => shownChars.indexOf(charId) === -1)
            .map((charId) => parseInt(charId))
    }, 100)

    const realmClick = function(): void {
        const realmString = this.firstChild.nodeValue.trim()

        const realmCharacters: string[] = find(
            realms,
            ([realm]) => realm === realmString
        )[1].map((char) => char.id.toString())

        const anyMissing: boolean = some(
            realmCharacters,
            (charId) => shownCharacters.indexOf(charId) === -1
        )
        const toChange: string[] = filter(
            realmCharacters,
            (charId) => !anyMissing || (anyMissing && shownCharacters.indexOf(charId) === -1)
        )

        for (const charId of toChange) {
            setTimeout(() => document.getElementById(`input-character_${charId}`).click())
        }
    }
</script>

<style lang="scss">
    .realm {
        h3 {
            cursor: pointer;
            font-size: 1.1rem;
            margin-top: 0.25rem;

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

        :global(fieldset[data-state="false"]) {
            background: rgba(255, 0, 0, 0.2);

            & :global(code) {
                background: none;
            }
        }
    }
</style>

<div class="thing-container settings-container">
    <h2>Hide Characters</h2>

    {#each realms as [realm, characters]}
        <div class="realm">
            <h3 on:click={realmClick}>
                {realm}
                <span>[click to toggle all]</span>
            </h3>

            {#each characters as character}
                <GroupedCheckbox
                    name="character_{character.id}"
                    bind:bindGroup={shownCharacters}
                    value={character.id.toString()}
                >
                    <code>{@html character.level < 10 ? '&nbsp;' : ''}{character.level}</code>
                    <span class="class-{character.classId}">{character.name}</span>
                </GroupedCheckbox>
            {/each}
        </div>
    {/each}
</div>
