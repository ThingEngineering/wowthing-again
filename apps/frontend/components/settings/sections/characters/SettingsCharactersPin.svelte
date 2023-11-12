<script lang="ts">
    import debounce from 'lodash/debounce'
    import sortBy from 'lodash/sortBy'

    import { userStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { settingsStore } from '@/user-home/stores/settings'
    import getCharacterSortFunc from '@/utils/get-character-sort-func'
    import type { SettingsChoice } from '@/user-home/stores/settings/types'

    import MagicLists from '../../SettingsMagicLists.svelte'

    const allCharacters: SettingsChoice[] = $userStore.characters.map((char) => ({
        key: char.id.toString(),
        name: `${char.name}-${char.realm.name}`,
    }))

    const sortFunc = getCharacterSortFunc($settingsStore, $staticStore)

    const activeCharacters = sortBy(
        allCharacters.filter(
            (char) => $settingsStore.characters.pinnedCharacters.indexOf(parseInt(char.key)) >= 0
        ),
        (char) => $settingsStore.characters.pinnedCharacters.indexOf(parseInt(char.key))
    )
    const inactiveCharacters = sortBy(
        allCharacters.filter(
            (char) => $settingsStore.characters.pinnedCharacters.indexOf(parseInt(char.key)) === -1
        ),
        (char) => sortFunc($userStore.characterMap[parseInt(char.key)])
    )

    const onFunc = debounce(() => {
        settingsStore.update(state => {
            state.characters.pinnedCharacters = activeCharacters.map((c) => parseInt(c.key))
            return state
        })
    }, 100)
</script>

<style lang="scss">
</style>

<div class="settings-block">
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
