import { UserCount } from '@/types';
import { ManualDataSetCategory, ManualDataSetGroup } from '@/types/data/manual';
import type { CollectibleState } from '../local-storage';
import type { ManualDataSetGroupArray } from '@/types/data/manual';
import type { Settings } from '@/shared/stores/settings/types';

interface LazyStores {
    collectibleState: CollectibleState;
    settings: Settings;
}

export interface LazyCollectible {
    filteredCategories: ManualDataSetCategory[][];
    stats: Record<string, UserCount>;
}

export function doCollectible(
    stores: LazyStores,
    collectionKey: string,
    categories: ManualDataSetCategory[][],
    userHas: Record<number, boolean>,
): LazyCollectible {
    if (!userHas) {
        return;
    }

    // console.time(`doCollectible(${collectionKey})`)

    const ret: LazyCollectible = {
        filteredCategories: categories,
        stats: {},
    };

    const hideUnavailable = stores.settings.collections.hideUnavailable;
    const showCollected = stores.collectibleState.showCollected[collectionKey];
    const showUncollected = stores.collectibleState.showUncollected[collectionKey];

    // Stats
    const overallData = (ret.stats['OVERALL'] = new UserCount());
    const overallSeen: Record<number, boolean> = {};

    for (const category of categories) {
        if (category === null) {
            continue;
        }

        const categoryData = (ret.stats[category[0].slug] = new UserCount());
        const categoryUnavailable = category[0].slug === 'unavailable';

        for (const set of category) {
            const setData = (ret.stats[`${category[0].slug}--${set.slug}`] = new UserCount());
            const setUnavailable = set.slug === 'unavailable';

            for (const group of set.groups) {
                const groupData = (ret.stats[`${category[0].slug}--${set.slug}--${group.name}`] =
                    new UserCount());
                const groupUnavailable = group.name.indexOf('Unavailable') >= 0;

                for (const things of group.things) {
                    const hasThing = things.some((t) => userHas[t]);
                    const seenOverall = things.some((t) => overallSeen[t]);

                    const doOverall =
                        !seenOverall &&
                        (hasThing ||
                            (!categoryUnavailable && !setUnavailable && !groupUnavailable));
                    const doCategory =
                        hasThing ||
                        (!setUnavailable &&
                            !groupUnavailable &&
                            (!hideUnavailable || !categoryUnavailable));
                    const doSet =
                        hasThing ||
                        !hideUnavailable ||
                        (!groupUnavailable && !setUnavailable && !categoryUnavailable);

                    if (doOverall) {
                        overallData.total++;
                    }
                    if (doCategory) {
                        categoryData.total++;
                    }
                    if (doSet) {
                        setData.total++;
                        groupData.total++;
                    }

                    if (hasThing) {
                        if (doOverall) {
                            overallData.have++;
                        }
                        if (doCategory) {
                            categoryData.have++;
                        }
                        if (doSet) {
                            setData.have++;
                            groupData.have++;
                        }
                    }

                    for (const thing of things) {
                        overallSeen[thing] = true;
                    }
                }
            }
        }
    }

    // Filtered categories
    if (hideUnavailable || !showCollected || !showUncollected) {
        ret.filteredCategories = [];
        for (const category of categories) {
            if (category === null) {
                ret.filteredCategories.push(null);
                continue;
            }

            const categoryUnavailable = category[0].slug === 'unavailable';

            const newCategory: ManualDataSetCategory[] = [];
            for (const set of category) {
                const setUnavailable = set.slug === 'unavailable';
                const newGroups: ManualDataSetGroup[] = [];
                for (const group of set.groups) {
                    const groupUnavailable = group.name.indexOf('Unavailable') >= 0;
                    const newThings: number[][] = group.things.filter((thing) => {
                        const hasThing = thing.some((thingId) => userHas[thingId]);

                        if (
                            hideUnavailable &&
                            (categoryUnavailable || setUnavailable || groupUnavailable) &&
                            !hasThing
                        ) {
                            return false;
                        }

                        return (showCollected && hasThing) || (showUncollected && !hasThing);
                    });

                    if (newThings.length > 0) {
                        newGroups.push(new ManualDataSetGroup(group.name, newThings));
                    }
                }

                const newGroupArrays: ManualDataSetGroupArray[] = newGroups.map((group) => [
                    group.name,
                    group.things,
                ]);
                newCategory.push(new ManualDataSetCategory(set.name, set.slug, newGroupArrays));
            }

            ret.filteredCategories.push(newCategory);
        }
    }

    // console.timeEnd(`doCollectible(${collectionKey})`)

    return ret;
}
