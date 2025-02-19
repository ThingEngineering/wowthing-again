import { get } from 'svelte/store';

import { userStore } from '@/stores';
import getRealmName from '@/utils/get-realm-name';

export function getCharacterNameRealm(characterId: number): string {
    const character = get(userStore).characterMap[characterId];
    return `${character.name} - ${getRealmName(character.realmId)}`;
}
