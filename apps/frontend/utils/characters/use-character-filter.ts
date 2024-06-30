import { get } from 'svelte/store';

import { classByArmorType } from '@/data/character-class';
import { Constants } from '@/data/constants';
import {
    isGatheringProfession,
    isCraftingProfession,
    professionSlugToId,
} from '@/data/professions';
import { ArmorType } from '@/enums/armor-type';
import { Faction } from '@/enums/faction';
import { Role } from '@/enums/role';
import { staticStore } from '@/shared/stores/static';
import { parseBooleanQuery } from '@/shared/utils/boolean-parser';
import { LazyStore, userStore } from '@/stores';
import type { Settings } from '@/shared/stores/settings/types';
import type { Character } from '@/types';
import type { UserQuestData } from '@/types/data';
import { QuestStatus } from '@/enums/quest-status';

type FilterFunc = (char: Character) => boolean;

const _cache: Record<string, string[][]> = {};

export function useCharacterFilter(
    lazyStore: LazyStore,
    settings: Settings,
    userQuestData: UserQuestData,
    filterFunc: FilterFunc,
    char: Character,
    filterString: string,
): boolean {
    let result = true;
    if (filterString?.length >= 2) {
        const staticData = get(staticStore);
        const userData = get(userStore);

        const filterLower = filterString.toLocaleLowerCase();
        const partArrays = (_cache[filterLower] ||= parseBooleanQuery(filterLower));
        // console.log(char.name, partArrays)

        const partCache: Record<string, boolean> = {};
        result = false;
        if (partArrays.length > 0) {
            result = partArrays.some((parts) =>
                parts.every(
                    (outerPart) =>
                        (partCache[outerPart] ||=
                            (function (part: string) {
                                if (char.name.toLocaleLowerCase().indexOf(part) >= 0) {
                                    return true;
                                }

                                // Level
                                let match = part.match(/^(level|lvl)(<|<=|=|>=|>)(\d+)$/);
                                if (match) {
                                    return compareValues(
                                        match[2].toString(),
                                        char.level,
                                        parseInt(match[3]),
                                    );
                                }

                                // Item level
                                match = part.match(/^(itemlevel|ilevel|ilvl)(<|<=|=|>=|>)(\d+)$/);
                                if (match) {
                                    return compareValues(
                                        match[2].toString(),
                                        char.equippedItemLevel,
                                        parseInt(match[3]),
                                    );
                                }

                                // Quests
                                match = part.match(/^(no)?quest=(.+)$/);
                                if (match) {
                                    const questString = match[2].toString();
                                    const questId = parseInt(questString);

                                    const charQuests = userQuestData.characters[char.id];
                                    let hasQuest = false;

                                    if (isNaN(questId)) {
                                        const matchingQuests = Object.entries(
                                            charQuests?.progressQuests || {},
                                        )
                                            .filter(
                                                ([key]) => key.toLocaleLowerCase() === questString,
                                            )
                                            .map(([, value]) => value);
                                        hasQuest =
                                            matchingQuests.length === 1 &&
                                            matchingQuests[0].status === QuestStatus.Completed;
                                    } else {
                                        hasQuest =
                                            charQuests?.quests?.has(questId) ||
                                            charQuests?.dailyQuests?.has(questId);
                                    }

                                    return match[1]?.toString() === 'no' ? !hasQuest : hasQuest;
                                }

                                // Account tag
                                match = part.match(/^accounttag=(.*)$/);
                                if (match) {
                                    const accountTag = match[1].toString();
                                    return (
                                        userData.accounts[char.accountId].tag.toLocaleLowerCase() ==
                                        accountTag
                                    );
                                }

                                // Tag
                                match = part.match(/^tag=(.*)$/);
                                if (match) {
                                    const tagName = match[1].toString().toLocaleLowerCase();
                                    const tag = (settings.tags || []).find(
                                        (t) => t.name.toLocaleLowerCase() === tagName,
                                    );
                                    return (
                                        tag &&
                                        ((settings.characters.flags?.[char.id] || 0) &
                                            (1 << tag.id)) >
                                            0
                                    );
                                }

                                // Realm slug
                                match = part.match(/^realm=(.+)$/);
                                if (match) {
                                    const slug = match[1].toString();
                                    return char.realm.slug === slug;
                                }

                                // Faction
                                if (part === 'alliance') {
                                    return char.faction === Faction.Alliance;
                                } else if (part === 'horde') {
                                    return char.faction === Faction.Horde;
                                } else if (part === 'netural') {
                                    return char.faction === Faction.Neutral;
                                }

                                // Race slug
                                const raceSlug = ['dracthyr', 'pandaren'].includes(part)
                                    ? `${part}${char.faction}`
                                    : part;
                                if (staticData.characterRacesBySlug[raceSlug]) {
                                    return (
                                        char.raceId === staticData.characterRacesBySlug[raceSlug].id
                                    );
                                }

                                // Class slug
                                let classSlug = part;
                                if (classSlug === 'dh') {
                                    classSlug = 'demon-hunter';
                                } else if (classSlug === 'dk') {
                                    classSlug = 'death-knight';
                                }
                                if (staticData.characterClassesBySlug[classSlug]) {
                                    return (
                                        char.classId ===
                                        staticData.characterClassesBySlug[classSlug].id
                                    );
                                }

                                // Armor type
                                if (part === 'cloth') {
                                    return (
                                        classByArmorType[ArmorType.Cloth].indexOf(char.classId) >= 0
                                    );
                                } else if (part === 'leather') {
                                    return (
                                        classByArmorType[ArmorType.Leather].indexOf(char.classId) >=
                                        0
                                    );
                                } else if (part === 'mail') {
                                    return (
                                        classByArmorType[ArmorType.Mail].indexOf(char.classId) >= 0
                                    );
                                } else if (part === 'plate') {
                                    return (
                                        classByArmorType[ArmorType.Plate].indexOf(char.classId) >= 0
                                    );
                                }

                                // Specializations
                                if (part === 'tank') {
                                    const spec =
                                        staticData.characterSpecializations[char.activeSpecId];
                                    return spec?.role === Role.Tank;
                                } else if (
                                    part === 'heal' ||
                                    part === 'healer' ||
                                    part === 'heals'
                                ) {
                                    const spec =
                                        staticData.characterSpecializations[char.activeSpecId];
                                    return spec?.role === Role.Healer;
                                } else if (part === 'dps' || part === 'deeps') {
                                    const spec =
                                        staticData.characterSpecializations[char.activeSpecId];
                                    return (
                                        spec?.role === Role.MeleeDps ||
                                        spec?.role === Role.RangedDps
                                    );
                                }

                                // Mythic+ score
                                match = part.match(/^m\+((<|<=|=|>=|>)(\d+))?$/);
                                if (match) {
                                    const mythicPlusScore =
                                        char.mythicPlusSeasonScores?.[Constants.mythicPlusSeason] ||
                                        0;
                                    if (match[2] && match[3]) {
                                        return compareValues(
                                            match[2].toString(),
                                            mythicPlusScore,
                                            parseInt(match[3]),
                                        );
                                    }
                                    return mythicPlusScore > 0;
                                }

                                // Profession slug
                                const professionSlug = professionSlugMap[part] || part;
                                if (professionSlugToId[professionSlug]) {
                                    return !!char.professions?.[professionSlugToId[professionSlug]];
                                }

                                // Profession type
                                if (part.match(/^(craft|crafter|crafting)$/)) {
                                    return Object.keys(char.professions || {}).some(
                                        (professionId) =>
                                            isCraftingProfession[parseInt(professionId)],
                                    );
                                }
                                if (part.match(/^(gather|gatherer|gathering)$/)) {
                                    return Object.keys(char.professions || {}).some(
                                        (professionId) =>
                                            isGatheringProfession[parseInt(professionId)],
                                    );
                                }

                                // Work orders available?
                                if (part === 'orders') {
                                    return (
                                        lazyStore.characters[char.id].professionWorkOrders.have > 0
                                    );
                                }

                                // Remix
                                if (part === 'remix') {
                                    return char.isRemix;
                                }

                                return false;
                            })(outerPart.replace(/^!/, '')) === outerPart.startsWith('!')
                                ? false
                                : true),
                ),
            );
        }
    }

    return filterFunc ? filterFunc(char) && result : result;
}

function compareValues(comparison: string, sourceValue: number, compareValue: number): boolean {
    if (comparison === '<') return sourceValue < compareValue;
    else if (comparison === '<=') return sourceValue <= compareValue;
    else if (comparison === '=') return sourceValue === compareValue;
    else if (comparison === '>=') return sourceValue >= compareValue;
    else if (comparison === '>') return sourceValue > compareValue;
}

const professionSlugMap: Record<string, string> = {
    alc: 'alchemy',
    alch: 'alchemy',
    alchemist: 'alchemist',
    blacksmith: 'blacksmithing',
    cook: 'cooking',
    ench: 'enchanting',
    enchant: 'enchanting',
    eng: 'engineering',
    engi: 'engineering',
    engineer: 'engineering',
    engy: 'engineering',
    herb: 'herbalism',
    mine: 'mining',
    scribe: 'inscription',
    skin: 'skinning',
    smith: 'blacksmithing',
    tailor: 'tailoring',
};
