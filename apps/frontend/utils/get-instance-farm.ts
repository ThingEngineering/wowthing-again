import sortBy from 'lodash/sortBy';
import type { DateTime } from 'luxon';

import { journalDifficultyMap } from '@/data/difficulty';
import { RewardType } from '@/enums/reward-type';
import { lazyState } from '@/user-home/state/lazy';
import { userState } from '@/user-home/state/user';
import { leftPad } from '@/utils/formatting';
import parseApiTime from '@/utils/parse-api-time';
import type { FarmStatus } from '@/types';
import type { JournalDataInstance } from '@/types/data';
import type { ManualDataZoneMapDrop, ManualDataZoneMapFarm } from '@/types/data/manual';
import { wowthingData } from '@/shared/stores/data';

export function getInstanceFarm(
    currentTime: DateTime,
    farm: ManualDataZoneMapFarm
): [FarmStatus, ManualDataZoneMapDrop[]] {
    const drops: ManualDataZoneMapDrop[] = [];
    const status: FarmStatus = {
        characters: [],
        drops: [],
        need: false,
    };

    const characterData: Record<number, boolean> = {};
    let instance: JournalDataInstance;
    for (const tier of wowthingData.journal.tiers.filter((tier) => tier !== null)) {
        const instances = tier.instances.filter((inst) => inst?.id === farm.id);
        if (instances.length > 0) {
            instance = instances[0];

            const instanceKey = `${tier.slug}--${instance.slug}`;
            const stats = lazyState.journal.stats[instanceKey];
            status.link = `${tier.slug}/${instance.slug}`;
            status.need = stats.have < stats.total;

            const difficulties: Set<number> = new Set();
            for (const encounter of instance.encounters) {
                for (const group of encounter.groups) {
                    for (const item of group.items) {
                        for (const appearance of item.appearances) {
                            for (const difficulty of appearance.difficulties) {
                                difficulties.add(difficulty);
                            }
                        }
                    }
                }
            }

            const sortedDifficulties = sortBy(
                Array.from(difficulties.values()),
                (diff) => journalDifficultyMap[diff]
            );
            for (const difficulty of sortedDifficulties) {
                const difficultyKey = `${instanceKey}--${difficulty}`;
                const difficultyStats = lazyState.journal.stats[difficultyKey];
                if (!difficultyStats) {
                    console.log(`no difficulty stats for key "${difficultyKey}"`);
                    continue;
                }

                const characterIds: number[] = [];
                const completedCharacterIds: number[] = [];
                const lockoutKey = `${instance.id}-${difficulty}`;

                const characters = userState.general.activeCharacters.filter(
                    (char) => char.level > 10
                );

                for (const character of characters) {
                    const lockout = character.lockouts?.[lockoutKey];
                    if (lockout) {
                        if (parseApiTime(lockout.resetTime) > currentTime) {
                            completedCharacterIds.push(character.id);
                        } else {
                            characterIds.push(character.id);
                        }
                    } else {
                        characterIds.push(character.id);
                    }

                    characterData[character.id] = true;
                }

                status.drops.push({
                    need: difficultyStats.have < difficultyStats.total,
                    skip: false,
                    validCharacters: true,
                    characterIds,
                    completedCharacterIds,
                });

                drops.push({
                    id: difficulty,
                    type: RewardType.InstanceSpecial,
                    subType: 0,
                    classMask: 0,
                    limit: [
                        `<code>${leftPad(difficultyStats.have, 3)} / ${leftPad(difficultyStats.total, 3)}</code>`,
                    ],
                });
            }

            break;
        }
    }

    status.characters = Object.keys(characterData).map((characterId) => ({
        id: parseInt(characterId),
        types: [RewardType.InstanceSpecial],
    }));

    return [status, drops];
}
