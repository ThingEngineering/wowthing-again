import sortBy from 'lodash/sortBy';

import { DataManual, type RawManual } from './types';
import {
    ManualDataCustomizationCategory,
    ManualDataHeirloomGroup,
    ManualDataIllusionGroup,
    ManualDataReputationCategory,
    ManualDataSetCategory,
    ManualDataSharedVendor,
    ManualDataTransmogCategory,
    ManualDataVendorCategory,
    ManualDataZoneMapCategory,
    type ManualDataSetCategoryArray,
} from '@/types/data/manual';

export function processManualData(rawData: RawManual): DataManual {
    console.time('processManualData');

    const data = new DataManual();

    for (const [tagId, tagName] of rawData.rawTags) {
        data.tagsById.set(tagId, tagName);
        data.tagsByName.set(tagName, tagId);
    }

    for (const vendorArray of rawData.rawSharedVendors) {
        const obj = new ManualDataSharedVendor(...vendorArray);
        data.shared.vendors[obj.id] = obj;

        for (const mapName of Object.keys(obj.locations)) {
            data.shared.vendorsByMap[mapName] ||= [];
            data.shared.vendorsByMap[mapName].push(obj.id);
        }

        for (const tag of obj.tags) {
            data.shared.vendorsByTag[tag] ||= [];
            data.shared.vendorsByTag[tag].push(obj.id);
        }
    }

    data.customizationCategories = rawData.rawCustomizationCategories.map((categories) =>
        categories === null
            ? null
            : categories.map((catArray) =>
                  catArray === null ? null : new ManualDataCustomizationCategory(...catArray),
              ),
    );

    data.heirlooms = rawData.rawHeirloomGroups.map(
        (groupArray) => new ManualDataHeirloomGroup(...groupArray),
    );

    data.illusions = rawData.rawIllusionGroups.map(
        (groupArray) => new ManualDataIllusionGroup(...groupArray),
    );

    data.mountSets = fixCollectionSets(rawData.rawMountSets);
    data.petSets = fixCollectionSets(rawData.rawPetSets);
    data.toySets = fixCollectionSets(rawData.rawToySets);

    data.reputationSets = rawData.rawReputationSets.map((repArray) =>
        repArray === null ? null : new ManualDataReputationCategory(...repArray),
    );

    data.transmog.sets = fixTransmogSets(
        rawData.rawTransmogSets.map((categories) =>
            categories === null
                ? null
                : categories.map((catArray) =>
                      catArray === null ? null : new ManualDataTransmogCategory(...catArray),
                  ),
        ),
    );

    data.vendors.sets = rawData.rawVendorSets.map((catArray) =>
        catArray === null ? null : new ManualDataVendorCategory(...catArray),
    );

    data.zoneMaps.sets = rawData.rawZoneMapSets.map((categories) =>
        categories === null
            ? null
            : categories.map((catArray) =>
                  catArray === null ? null : new ManualDataZoneMapCategory(...catArray),
              ),
    );

    for (const categories of data.customizationCategories) {
        if (categories === null) {
            continue;
        }

        for (const category of categories.slice(1)) {
            if (category === null) {
                continue;
            }

            for (const group of category.groups) {
                for (const thing of group.things) {
                    if (!thing.itemId || !thing.questId) {
                        continue;
                    }

                    if (categories[0].slug === 'class') {
                        if (category.slug === 'druid') {
                            data.druidFormItemToQuest.set(thing.itemId, thing.questId);
                        }
                    } else if (categories[0].slug === 'dragonriding') {
                        data.dragonridingItemToQuest.set(thing.itemId, thing.questId);
                    }
                }
            }
        }
    }

    console.timeEnd('processManualData');

    return data;
}

function fixCollectionSets(allSets: ManualDataSetCategoryArray[][]): ManualDataSetCategory[][] {
    const newSets: ManualDataSetCategory[][] = [];

    for (const sets of allSets) {
        if (sets === null) {
            newSets.push(null);
            continue;
        }

        const actualSets = sets.map((set) => new ManualDataSetCategory(...set));

        newSets.push(
            sortBy(actualSets, (set) => [
                set.name.startsWith('<') ? 0 : 1,
                set.name.startsWith('>') ? 1 : 0,
            ]),
        );

        for (const set of newSets[newSets.length - 1]) {
            if (set.name.startsWith('<') || set.name.startsWith('>')) {
                set.name = set.name.substring(1);
            }
        }
    }

    return newSets;
}

function fixTransmogSets(allSets: ManualDataTransmogCategory[][]): ManualDataTransmogCategory[][] {
    const newSets: ManualDataTransmogCategory[][] = [];

    for (const sets of allSets) {
        if (sets === null) {
            newSets.push(null);
        } else {
            newSets.push(
                sortBy(sets, (set) => [
                    set.name.startsWith('<') ? 0 : 1,
                    set.name.startsWith('>') ? 1 : 0,
                ]),
            );

            for (const set of newSets[newSets.length - 1]) {
                if (set.name.startsWith('<') || set.name.startsWith('>')) {
                    set.name = set.name.substring(1);
                }
            }
        }
    }

    return newSets;
}
