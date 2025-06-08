import uniq from 'lodash/uniq';
import without from 'lodash/without';
import xor from 'lodash/xor';

import { raidDifficulties } from '@/data/difficulty';
import { worldBossInstanceIds } from '@/data/dungeon';
import { extraTiers } from '@/data/journal';
import { JournalDataEncounter } from '@/types/data';
import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';

import { DataJournal, type RawJournal } from './types';

export function processJournalData(rawData: RawJournal): DataJournal {
    console.time('processJournalData');
    const data = new DataJournal();

    data.itemExpansion = rawData.itemExpansion;
    data.tiers = rawData.tiers;
    data.tokenEncounters = rawData.tokenEncounters;

    for (const [tokenId, itemIds] of getNumberKeyedEntries(rawData.itemExpansion)) {
        for (const itemId of itemIds) {
            (data.expandedItem[itemId] ||= []).push(tokenId);
        }
    }

    for (let tierIndex = 0; tierIndex < rawData.tiers.length; tierIndex++) {
        const tier = rawData.tiers[tierIndex];
        if (!tier) {
            continue;
        }

        for (const extraTier of extraTiers) {
            if (extraTier.id !== 1000099) {
                extraTier.subTiers.push({
                    id: 1000000 + tier.id,
                    name: tier.name,
                    slug: tier.slug,
                    instances: [],
                });
            }
        }

        let order = (tierIndex + 1) * 100;
        for (const instance of tier.instances.filter((instance) => instance !== null)) {
            if (instance.encountersRaw !== null) {
                data.instanceById[instance.id] = instance;

                instance.order = order--;

                instance.encounters = instance.encountersRaw.map(
                    (encounterArray) => new JournalDataEncounter(...encounterArray)
                );
                instance.encountersRaw = null;

                // Zul'Gurub hack to fix difficulties
                if (instance.id === 76) {
                    for (const encounter of instance.encounters) {
                        for (const group of encounter.groups) {
                            for (const item of group.items) {
                                for (const appearance of item.appearances) {
                                    if (xor([3, 4, 5, 6], appearance.difficulties).length === 0) {
                                        appearance.difficulties.length = 0;
                                        appearance.difficulties.push(1, 2);
                                    }
                                }
                            }
                        }
                    }
                }

                const difficulties = uniq(
                    instance.encounters
                        .map((encounter) =>
                            encounter.groups.map((group) =>
                                group.items.map((item) =>
                                    item.appearances.map((appearance) => appearance.difficulties)
                                )
                            )
                        )
                        .flat(Infinity)
                );

                const withoutRaid = without(difficulties, ...raidDifficulties);

                if (worldBossInstanceIds.indexOf(instance.id) >= 0) {
                    const wbInstance = {
                        ...instance,
                        name: tier.name,
                        slug: tier.slug,
                    };
                    extraTiers[2].instances.push(wbInstance);
                    instance.isRaid = true;
                } else if (withoutRaid.length === 0) {
                    extraTiers[1].subTiers[extraTiers[1].subTiers.length - 1].instances.push(
                        instance
                    );
                    instance.isRaid = true;
                } else {
                    // Possibly not all dungeons but close enough
                    extraTiers[0].subTiers[extraTiers[0].subTiers.length - 1].instances.push(
                        instance
                    );
                    instance.isRaid = false;
                }
            }
        }
    }

    data.tiers.push(null);
    data.tiers.push(...extraTiers);

    console.timeEnd('processJournalData');
    return data;
}
