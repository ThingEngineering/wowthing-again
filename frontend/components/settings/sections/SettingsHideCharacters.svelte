<script lang="ts">
    import groupBy from 'lodash/groupBy'
    import sortBy from 'lodash/sortBy'

    import type { Character } from '@/types'
    import { userStore } from '@/stores'
    import {data as settingsData} from '@/stores/settings'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'

    import GroupedCheckbox from '@/components/forms/GroupedCheckboxInput.svelte'

    const allCharacterIds: string[] = $userStore.data.characters.map((char) => char.id.toString())
    let shownCharacters: string[] = $userStore.data.characters
        .filter((char) => $settingsData.characters.hiddenCharacters.indexOf(char.id) === -1)
        .map((char) => char.id.toString())

    let realms: [string, Character[]][]
    $: {
        const sortFunc = getCharacterSortFunc($settingsData)

        const grouped: Record<string, Character[]> = groupBy($userStore.data.characters, (c) => c.realm.name)
        for (const realmName in grouped) {
            grouped[realmName] = sortBy(grouped[realmName], sortFunc)
        }

        realms = Object.entries(grouped)
        realms.sort()
    }

    $: {
        $settingsData.characters.hiddenCharacters = allCharacterIds
            .filter((charId) => shownCharacters.indexOf(charId) === -1)
            .map((charId) => parseInt(charId))
    }
</script>

<style lang="scss">
    .realm {
        h3 {
            font-size: 1.1rem;
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
            <h3>{realm}</h3>

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
