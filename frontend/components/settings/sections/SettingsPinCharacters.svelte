<script lang="ts">
    import debounce from 'lodash/debounce'
    import filter from 'lodash/filter'
    import sortBy from 'lodash/sortBy'

    import { userStore } from '@/stores'
    import { data as settingsData } from '@/stores/settings'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import type { SettingsChoice } from '@/types'

    import MagicLists from '../SettingsMagicLists.svelte'

    const allCharacters: SettingsChoice[] = $userStore.data.characters.map((char) => ({
        key: char.id,
        name: `${char.name}-${char.realm.name}`,
    }))

    const sortFunc = getCharacterSortFunc($settingsData)

    const activeCharacters = sortBy(
        filter(
            allCharacters,
            (char) => $settingsData.characters.pinnedCharacters.indexOf(char.key) >= 0
        ),
        (char) => $settingsData.characters.pinnedCharacters.indexOf(char.key)
    )
    const inactiveCharacters = sortBy(
        filter(
            allCharacters,
            (char) => $settingsData.characters.pinnedCharacters.indexOf(char.key) === -1
        ),
        (char) => sortFunc($userStore.data.characterMap[char.key])
    )

    const onFunc = debounce(() => {
        settingsData.update(state => {
            state.characters.pinnedCharacters = activeCharacters.map((c) => c.key)
            return state
        })
    }, 100)

</script>

<style lang="scss">
</style>

<div class="thing-container settings-container">
    <h2>Pin Characters</h2>

    <p>
        Search for characters and "pin" them to the top of the characters table. Drag and drop to change
        the order of the pinned characters.
    </p>

    <MagicLists
        key="pin"
        title="Pin Characters"
        onFunc={onFunc}
        active={activeCharacters}
        inactive={inactiveCharacters}
    />
</div>
