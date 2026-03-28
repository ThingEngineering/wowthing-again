import { createContext } from 'svelte';
import type { Character } from '@/types/character/character.svelte';

interface CharacterTableContext {
    characters: Character[];
}

export const [getCharacterTableContext, setCharacterTableContext] =
    createContext<() => CharacterTableContext>();
