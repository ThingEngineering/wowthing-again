<script lang="ts">
    import groupBy from 'lodash/groupBy'
    import sortBy from 'lodash/sortBy'

    import type { Character } from '@/types'
    import { userStore } from '@/stores'
    import {data as settingsData} from '@/stores/settings'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'

    import GroupedCheckbox from '@/components/forms/GroupedCheckboxInput.svelte'

    let hiddenCharacters: string[] = $settingsData.characters.hiddenCharacters.map((c) => c.toString())

    let realms: [string, Character[]][]
    $: {
        const sortFunc = getCharacterSortFunc()

        const grouped: Record<string, Character[]> = groupBy($userStore.data.characters, (c) => c.realm.name)
        for (const realmName in grouped) {
            grouped[realmName] = sortBy(grouped[realmName], sortFunc)
        }

        realms = Object.entries(grouped)
        realms.sort()
    }

    $: {
        $settingsData.characters.hiddenCharacters = hiddenCharacters.map((c) => parseInt(c))
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

        :global(fieldset[data-state="true"]) {
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
                    bind:bindGroup={hiddenCharacters}
                    value={character.id.toString()}
                >
                    <code>{@html character.level < 10 ? '&nbsp;' : ''}{character.level}</code>
                    <span class="class-{character.classId}">{character.name}</span>
                </GroupedCheckbox>
            {/each}
        </div>
    {/each}
</div>
