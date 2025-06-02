import { Character, type UserData } from '@/types';

export class DataUserGeneral {
    public characters: Character[] = $state([]);
    public characterMap: Record<number, Character> = $state({});

    public process(userData: UserData): void {
        console.log(userData);
        console.time('DataUserGeneral.process');

        for (const characterArray of userData.charactersRaw) {
            const characterId = characterArray[0];
            let character = this.characterMap[characterId];
            const existed = !!character;

            if (existed) {
                const lastApiUpdateUnix = characterArray[21];
                const lastSeenAddonUnix = characterArray[22];
                if (
                    lastApiUpdateUnix > character.lastApiUpdateUnix ||
                    lastSeenAddonUnix > character.lastSeenAddonUnix
                ) {
                    character.init(...characterArray);
                    console.log('updated', character.id, character.name);
                }
            } else {
                character = new Character();
                character.init(...characterArray);
                this.characters.push(character);
                this.characterMap[characterId] = character;
            }
        }
        console.timeEnd('DataUserGeneral.process');
    }
}
