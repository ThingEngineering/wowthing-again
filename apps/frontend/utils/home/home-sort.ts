import type { DateTime } from 'luxon';

import { Constants } from '@/data/constants';
import { dungeonMap } from '@/data/dungeon';
import { leftPad } from '@/utils/formatting';
import { getNextWeeklyReset } from '@/utils/get-next-reset';
import { getVaultItemLevel } from '@/utils/mythic-plus';
import type { SettingsView } from '@/shared/stores/settings/types';
import type { LazyStore } from '@/stores';
import type { Character } from '@/types';

import { getCharacterRested } from '../get-character-rested';
import { getDungeonLevel } from '../mythic-plus/get-dungeon-level';
import getRaidVaultItemLevel from '../get-raid-vault-item-level';
import { getWorldTier } from '../vault/get-world-tier';
import { StatType } from '@/enums/stat-type';

export function homeSort(
    activeView: SettingsView,
    lazyStore: LazyStore,
    currentTime: DateTime,
    sortBy: string,
    char: Character
): string {
    if (sortBy === 'gold') {
        return leftPad(10_000_000 - char.gold, 8, '0');
    } else if (sortBy === 'bagSpace') {
        return leftPad(100 - char.bagSlotsFree, 3, '0');
    } else if (sortBy === 'bestItemLevel') {
        return leftPad(
            10000 -
                Math.floor(parseFloat(char.bestItemLevels?.[char.activeSpecId]?.[0] || '0.0') * 10),
            5,
            '0'
        );
    } else if (sortBy === 'itemLevel') {
        return leftPad(
            10000 - Math.floor(parseFloat(char.calculatedItemLevel || '0.0') * 10),
            5,
            '0'
        );
    } else if (sortBy === 'lastSeenAddon') {
        return leftPad(2_000_000_000_000 - (char.lastSeenAddon?.toMillis() || 0), 13, '0');
    } else if (sortBy === 'locationCurrent') {
        // adding two spaces makes it sort before " > blah"
        return char.currentLocation + '  ' || 'ZZZZZ';
    } else if (sortBy === 'locationHearth') {
        // adding two spaces makes it sort before " > blah"
        return char.hearthLocation + '  ' || 'ZZZZZ';
    } else if (sortBy === 'mythicPlusKeystone') {
        if (char.level === Constants.characterMaxLevel && char.weekly?.keystoneScannedAt) {
            const resetTime = getNextWeeklyReset(char.weekly.keystoneScannedAt, char.realm.region);
            if (resetTime > currentTime) {
                return (
                    leftPad(100 - (char.weekly?.keystoneLevel || 0), 3, '0') +
                    (dungeonMap[char.weekly?.keystoneDungeon]?.abbreviation || 'ZZ')
                );
            }
        }

        return '100|ZZ';
    } else if (sortBy === 'mythicPlusScore') {
        const rating =
            char.mythicPlusSeasonScores?.[Constants.mythicPlusSeason] ||
            char.raiderIo?.[Constants.mythicPlusSeason]?.all ||
            0;
        return leftPad(Math.floor(100000 - rating * 10), 6, '0');
    } else if (sortBy === 'professionCooldowns') {
        const cooldownData = lazyStore.characters[char.id].professionCooldowns;
        return leftPad(
            100 - (cooldownData.total > 0 ? (cooldownData.have / cooldownData.total) * 100 : -1),
            3,
            '0'
        );
    } else if (sortBy === 'professionWorkOrders') {
        const orderData = lazyStore.characters[char.id].professionWorkOrders;
        return leftPad(10 - (orderData.total > 0 ? orderData.have : -1), 3, '0');
    } else if (sortBy === 'restedExperience') {
        if (char.level === Constants.characterMaxLevel) {
            return '999';
        } else {
            const [rested] = getCharacterRested(currentTime, char);
            return leftPad(999 - parseInt(rested), 3, '0');
        }
    } else if (sortBy === 'statsSpeed') {
        return leftPad(
            9999999 - (char.statistics?.rating?.[StatType.SpeedRating]?.ratingBonus || 0),
            7,
            '0'
        );
    } else if (sortBy === 'vaultMythicPlus') {
        if (char.weekly?.vault?.generatedRewards) {
            return '000|000|000';
        } else if (char.weekly?.vault?.availableRewards) {
            return '001|001|001';
        }

        const progress = char.isMaxLevel ? char.weekly?.vault?.dungeonProgress : [];
        return [
            leftPad(900 - getVaultItemLevel(getDungeonLevel(progress?.[0]))[0], 3, '0'),
            leftPad(900 - getVaultItemLevel(getDungeonLevel(progress?.[1]))[0], 3, '0'),
            leftPad(900 - getVaultItemLevel(getDungeonLevel(progress?.[2]))[0], 3, '0'),
        ].join('|');
    } else if (sortBy === 'vaultRaid') {
        if (char.weekly?.vault?.generatedRewards) {
            return '000|000|000';
        } else if (char.weekly?.vault?.availableRewards) {
            return '001|001|001';
        }

        const progress = char.isMaxLevel ? char.weekly?.vault?.raidProgress : [];
        return [
            leftPad(900 - getRaidVaultItemLevel(progress?.[0])[0], 3, '0'),
            leftPad(900 - getRaidVaultItemLevel(progress?.[1])[0], 3, '0'),
            leftPad(900 - getRaidVaultItemLevel(progress?.[2])[0], 3, '0'),
        ].join('|');
    } else if (sortBy === 'vaultWorld') {
        if (char.weekly?.vault?.generatedRewards) {
            return '000|000|000';
        } else if (char.weekly?.vault?.availableRewards) {
            return '001|001|001';
        }

        const progress = char.isMaxLevel ? char.weekly?.vault?.worldProgress : [];
        return [
            leftPad(900 - getWorldTier(progress?.[0]?.level)[0], 3, '0'),
            leftPad(900 - getWorldTier(progress?.[1]?.level)[0], 3, '0'),
            leftPad(900 - getWorldTier(progress?.[2]?.level)[0], 3, '0'),
        ].join('|');
    } else if (sortBy.startsWith('currency:')) {
        const currencyId = parseInt(sortBy.split(':')[1]);
        const value =
            currencyId > 1_000_000
                ? char.getItemCount(currencyId - 1_000_000)
                : char.currencies?.[currencyId]?.quantity || 0;
        return leftPad(1000000 - value, 7, '0');
    } else if (sortBy.startsWith('item:')) {
        const itemId = parseInt(sortBy.split(':')[1]);
        return leftPad(1000000 - char.getItemCount(itemId), 7, '0');
    } else if (sortBy.startsWith('lockout:')) {
        const lockoutKey = sortBy.split(':')[1];
        const lockout = char.lockouts?.[lockoutKey];
        if (lockout?.locked === true) {
            return [
                leftPad(100 - lockout.defeatedBosses, 3, '0'),
                leftPad(100 - lockout.maxBosses, 3, '0'),
            ].join('|');
        } else {
            return '999|999';
        }
    } else if (sortBy.startsWith('task:')) {
        let value = -5;
        const taskName = `${activeView.id}|${sortBy.split(':')[1]}`;

        const charChore = lazyStore.characters[char.id].chores[taskName];
        if (charChore) {
            value = charChore.countCompleted * 100 + charChore.countStarted;
            if (charChore.countTotal > 0 && charChore.countCompleted === charChore.countTotal) {
                value += 5000;
            }
        } else {
            const charTask = lazyStore.characters[char.id].tasks[taskName];
            if (charTask) {
                if (charTask.text === 'Done') {
                    value = 9999;
                } else if (charTask.text === 'Get!') {
                    value = -1;
                } else {
                    const percentMatch = charTask.text.match(/^(\d+) %$/);
                    if (percentMatch) {
                        value = parseInt(percentMatch[1]);
                    } else {
                        const countMatch = charTask.text.match(/^(\d+) \/ (\d+)$/);
                        if (countMatch) {
                            value = Math.floor(
                                (parseInt(countMatch[1]) / parseInt(countMatch[2])) * 100
                            );
                        }
                    }
                }
            }
        }

        return leftPad(10000 - value, 5, '0');
    }
}
