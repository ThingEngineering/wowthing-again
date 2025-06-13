import { userState } from '@/user-home/state/user';

export function getCharacterNameRealm(characterId: number): string {
    const character = userState.general.characterById[characterId];
    return `${character?.name || 'Unknown Character'} - ${character?.realm?.name || 'Unknown Realm'}`;
}
