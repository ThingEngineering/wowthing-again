import type { Character, Settings, UserData } from '@/types'

export function getFilteredCharacters(
    settings: Settings,
    userData: UserData,
    filterIgnored = false
): Character[] {
    return userData.characters
        .filter((character) =>
            settings.characters.hiddenCharacters.indexOf(character.id) === -1 &&
            (!filterIgnored || settings.characters.ignoredCharacters.indexOf(character.id) === -1)
        )
}
