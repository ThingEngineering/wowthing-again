import { derived, type Readable } from 'svelte/store';

import { getCharacterLevel } from './get-character-level';
import { Constants } from '@/data/constants';
import { PlayableClass } from '@/enums/playable-class';
import { Region } from '@/enums/region';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { leftPad } from '@/utils/formatting';
import type { Character } from '@/types';

type SortValueFunction = (char: Character) => string;

export const getCharacterSortFunc: Readable<
    (prefixFunc?: SortValueFunction, viewSortBy?: string[]) => SortValueFunction
> = derived(
    [],
    () =>
        (prefixFunc?: SortValueFunction, viewSortBy?: string[]): SortValueFunction => {
            const sortBy = viewSortBy || settingsState.value.views[0].sortBy || ['level', 'name'];

            return (char: Character) => {
                const out: string[] = [];

                if (prefixFunc) {
                    out.push(prefixFunc(char));
                }

                const index =
                    settingsState.value.characters.pinnedCharacters?.indexOf(char.id) ?? -1;
                out.push(leftPad(index >= 0 ? index : 999, 3, '0'));

                for (const thing of sortBy) {
                    if (thing === 'account') {
                        out.push(
                            settingsState.value.accounts?.[char.accountId]?.tag ??
                                `account${char.accountId}`
                        );
                    } else if (thing === 'armor' || thing === '-armor') {
                        const desc = thing === '-armor';
                        switch (char.classId) {
                            case PlayableClass.Mage:
                            case PlayableClass.Priest:
                            case PlayableClass.Warlock:
                                out.push(desc ? '4' : '1');
                                break;

                            case PlayableClass.DemonHunter:
                            case PlayableClass.Druid:
                            case PlayableClass.Monk:
                            case PlayableClass.Rogue:
                                out.push(desc ? '3' : '2');
                                break;

                            case PlayableClass.Hunter:
                            case PlayableClass.Shaman:
                            case PlayableClass.Evoker:
                                out.push(desc ? '2' : '3');
                                break;

                            case PlayableClass.Paladin:
                            case PlayableClass.DeathKnight:
                            case PlayableClass.Warrior:
                                out.push(desc ? '1' : '4');
                                break;

                            default:
                                out.push('9');
                                break;
                        }
                    } else if (thing === 'class') {
                        out.push(wowthingData.static.characterClassById.get(char.classId).name);
                    } else if (thing === 'enabled') {
                        const enabled =
                            settingsState.value.accounts?.[char.accountId]?.enabled ?? true;
                        out.push(enabled ? 'a' : 'z');
                    } else if (thing === 'faction') {
                        out.push(char.faction.toString());
                    } else if (thing === '-faction') {
                        out.push((5 - char.faction).toString());
                    } else if (thing === 'gold') {
                        out.push(leftPad(10_000_000 - char.gold, 8, '0'));
                    } else if (thing === 'guild') {
                        if (char.guild) {
                            out.push(`${char.guild.name}--${char.realm?.name || 'ZZZ'}`);
                        } else {
                            out.push('ZZZZZZ');
                        }
                    } else if (thing === 'itemlevel' || thing == 'itemLevel') {
                        // TODO remove me once users are fixed
                        out.push(
                            leftPad(
                                10000 -
                                    Math.floor(parseFloat(char.calculatedItemLevel || '0.0') * 10),
                                5,
                                '0'
                            )
                        );
                    } else if (thing === 'level') {
                        // in descending order
                        const levelData = getCharacterLevel(char);
                        out.push(
                            [
                                leftPad(Constants.characterMaxLevel - levelData.level, 2, '0'),
                                (levelData.level > 10 ? 9 - levelData.partial : 0).toString(),
                            ].join('.')
                        );
                    } else if (thing === 'mplusrating') {
                        const rating =
                            char.mythicPlusSeasonScores?.[Constants.mythicPlusSeason] ||
                            char.raiderIo?.[Constants.mythicPlusSeason]?.all ||
                            0;
                        out.push(leftPad(Math.floor(100000 - rating * 10), 6, '0'));
                    } else if (thing === 'name') {
                        out.push(char.name);
                    } else if (thing === 'realm') {
                        out.push(Region[char.realm.region]);
                        out.push(char.realm.name);
                    } else if (thing.startsWith('tag:')) {
                        const tagId = parseInt(thing.substring(4));
                        const hasFlag =
                            ((settingsState.value.characters.flags?.[char.id] || 0) &
                                (1 << tagId)) >
                            0;
                        out.push(hasFlag ? '0' : '1');
                    }
                }

                return out.join('|');
            };
        },
    undefined
);
