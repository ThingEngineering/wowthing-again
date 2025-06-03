import uniq from 'lodash/uniq';
import { get } from 'svelte/store';

import { staticStore } from '@/shared/stores/static';
import { Character, Guild, type Account, type UserData } from '@/types';
import type { Region } from '@/enums/region';

export class DataUserGeneral {
    public accountMap: Record<number, Account> = $state({});
    public characters: Character[] = $state([]);
    public characterMap: Record<number, Character> = $state({});
    public guildMap: Record<number, Guild> = $state({});
    public regions: Region[] = $state([]);

    public process(userData: UserData): void {
        console.log(userData);
        console.time('DataUserGeneral.process');

        const staticData = get(staticStore);

        // Create or update Guild objects
        for (const guildArray of userData.guildsRaw) {
            const guild = new Guild();
            guild.init(...guildArray);
            this.guildMap[guild.id] = guild;
        }

        // Create or update Character objects
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

            character.realm ||= staticData.realms[character.realmId];
        }

        const regions = uniq(
            this.characters.map((char) => char.realm?.region).filter((region) => !!region)
        );
        regions.sort();
        this.regions = regions;

        console.timeEnd('DataUserGeneral.process');
    }
}
