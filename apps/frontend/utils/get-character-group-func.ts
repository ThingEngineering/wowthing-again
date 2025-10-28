import { Constants } from '@/data/constants';
import { wowthingData } from '@/shared/stores/data';
import type { Character } from '@/types';
import type { Settings } from '@/shared/stores/settings/types';

export type GetGroupCharacterFn = (char: Character) => string;

export interface GroupByContext {
    groupBy: string[];
    sortBy: string[];
    groupByFn: GetGroupCharacterFn;
}

export function getCharacterGroupContext(
    settingsData: Settings,
    viewGroupBy?: string[],
    viewSortBy?: string[]
): GroupByContext {
    const groupBy = viewGroupBy || settingsData.views[0].groupBy || [];
    const sortBy = viewSortBy || settingsData.views[0].sortBy || [];
    const minusFaction = sortBy.indexOf('-faction') >= 0;

    return {
        groupBy,
        sortBy,
        groupByFn: (char: Character) => {
            const out: string[] = [];

            for (const thing of groupBy) {
                if (thing === 'account') {
                    out.push(
                        settingsData.accounts?.[char.accountId]?.tag ?? `account${char.accountId}`
                    );
                } else if (thing === 'class') {
                    out.push(wowthingData.static.characterClassById.get(char.classId)?.slug);
                } else if (thing === 'enabled') {
                    const enabled = settingsData.accounts?.[char.accountId]?.enabled ?? true;
                    out.push(enabled ? 'a' : 'z');
                } else if (thing === 'faction') {
                    if (minusFaction) {
                        out.push((5 - char.faction).toString());
                    } else {
                        out.push(char.faction.toString());
                    }
                } else if (thing === 'guild') {
                    out.push(char.guild ? `${char.guild.name}-${char.guild.realm.name}` : 'ZZZZZ');
                    out.push(char.guild?.name);
                } else if (thing === 'maxlevel') {
                    out.push(char.level === Constants.characterMaxLevel ? 'a' : 'z');
                } else if (thing === 'pinned') {
                    out.push(
                        settingsData.characters.pinnedCharacters.indexOf(char.id) >= 0 ? 'a' : 'z'
                    );
                } else if (thing === 'race') {
                    out.push(wowthingData.static.characterRaceById.get(char.raceId)?.slug);
                } else if (thing === 'realm') {
                    out.push(
                        wowthingData.static.connectedRealmById.get(char.realm.connectedRealmId)
                            ?.displayText || '???'
                    );
                } else if (thing.startsWith('tag:')) {
                    const tagId = parseInt(thing.substring(4));
                    const hasFlag =
                        ((settingsData.characters.flags?.[char.id] || 0) & (1 << tagId)) > 0;
                    out.push(hasFlag ? '0' : '1');
                }
            }

            return out.join('|');
        },
    };
}
