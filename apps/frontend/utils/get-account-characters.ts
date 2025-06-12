import sortBy from 'lodash/sortBy';

import type { Character } from '@/types';
import { userState } from '@/user-home/state/user';

export default function getAccountCharacters(accountId: number): Character[] {
    return sortBy(
        userState.general.characters.filter((character) => character.accountId === accountId),
        (character) => character.name
    );
}
