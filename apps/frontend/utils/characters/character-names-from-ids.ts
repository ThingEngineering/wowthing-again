import { classOrderMap } from '@/data/character-class';
import { userState } from '@/user-home/state/user';

export function characterNamesFromIds(characterIds: number[]) {
    const characters = userState.general.activeCharacters.filter((char) =>
        characterIds.includes(char.id)
    );
    characters.sort((a, b) => classOrderMap[a.classId] - classOrderMap[b.classId]);
    return characters.map(
        (char) => `<span class="class-${char.classId}">${char.name}</span>-${char.realm.name}`
    );
}
