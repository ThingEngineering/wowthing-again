import { UserCount } from '@/types';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import type { ManualDataHeirloomItem } from '@/types/data/manual/heirloom';
import type { ManualDataIllusionItem } from '@/types/data/manual/illusion';

import { DataUserGeneral } from './data/general.svelte';
import {
    ManualDataSetCategory,
    ManualDataSetGroup,
    type ManualDataSetGroupArray,
} from '@/types/data/manual/set';
import { browserState, type CollectibleState } from '@/shared/state/browser.svelte';

type GenericCategory<T> = {
    name: string;
    items: T[];
};
type DoGenericParameters<T, U> = {
    categories: T[];
    haveFunc: (item: U) => boolean;
    includeUnavailable: boolean;
    haveCountFunc?: (item: U) => number;
    totalCountFunc?: (item: U) => number;
};

type UserCounts = Record<string, UserCount>;

interface UserCollectible {
    filteredCategories: ManualDataSetCategory[][];
    stats: Record<string, UserCount>;
}

class UserState {
    public general = new DataUserGeneral();
    // userAchievementData: UserAchievementData;
    // userQuestData: UserQuestData;

    public heirloomStats = $derived.by(() => this._heirlooms());
    public illusionStats = $derived.by(() => this._illusions());
    public mounts = $derived.by(() => this._mounts());
    public pets = $derived.by(() => this._pets());
    public toys = $derived.by(() => this._toys());

    public something() {
        // TODO: fetch user/achievements/quests
        // TODO: process
        // this.general.process(userData);
    }

    private _heirlooms(): UserCounts {
        return this.doGeneric({
            categories: wowthingData.manual.heirlooms,
            includeUnavailable: settingsState.value.collections.hideUnavailable,
            haveFunc: (heirloom: ManualDataHeirloomItem) =>
                this.general.heirlooms.get(
                    wowthingData.static.heirloomByItemId.get(heirloom.itemId).id
                ) !== undefined,
            totalCountFunc: (heirloom: ManualDataHeirloomItem) =>
                wowthingData.static.heirloomByItemId.get(heirloom.itemId).upgradeBonusIds.length +
                1,
            haveCountFunc: (heirloom: ManualDataHeirloomItem) => {
                const staticHeirloom = wowthingData.static.heirloomByItemId.get(heirloom.itemId);
                const userCount = this.general.heirlooms.get(staticHeirloom.id);
                return userCount !== undefined ? userCount + 1 : 0;
            },
        });
    }

    private _illusions(): UserCounts {
        return this.doGeneric({
            categories: wowthingData.manual.illusions,
            includeUnavailable: settingsState.value.collections.hideUnavailable,
            haveFunc: (illusion: ManualDataIllusionItem) =>
                userState.general.hasIllusionByEnchantmentId.has(illusion.enchantmentId),
        });
    }

    private _mounts() {
        return this._doCollectible('mounts', wowthingData.manual.mountSets, (id) =>
            this.general.hasMountById.has(id)
        );
    }

    private _pets() {
        return this._doCollectible('pets', wowthingData.manual.petSets, (id) =>
            this.general.hasPetById.has(id)
        );
    }

    private _toys() {
        return this._doCollectible('toys', wowthingData.manual.toySets, (id) =>
            this.general.hasToyByItemId.has(id)
        );
    }

    private _doCollectible(
        collectionKey: string,
        categories: ManualDataSetCategory[][],
        userHasFunc: (id: number) => boolean
    ): UserCollectible {
        // console.time(`doCollectible(${collectionKey})`)

        const ret: UserCollectible = {
            filteredCategories: categories,
            stats: {},
        };

        const hideUnavailable = settingsState.value.collections.hideUnavailable;

        const collectibleState = browserState.current[
            `collectible-${collectionKey}` as keyof typeof browserState.current
        ] as CollectibleState;
        const showCollected = collectibleState.showCollected;
        const showUncollected = collectibleState.showUncollected;

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
                const setSeen = new Set<number>();

                for (const group of set.groups) {
                    const groupData = (ret.stats[
                        `${category[0].slug}--${set.slug}--${group.name}`
                    ] = new UserCount());
                    const groupUnavailable = group.name.indexOf('Unavailable') >= 0;

                    for (const things of group.things) {
                        const hasThing = things.some((t) => userHasFunc(t));
                        const seenOverall = things.some((t) => overallSeen[t]);
                        const seenSet = things.some((t) => setSeen.has(t));
                        console.log(collectionKey, things, hasThing);

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
                            if (!seenSet) {
                                setData.total++;
                            }
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
                                if (!seenSet) {
                                    setData.have++;
                                }
                                groupData.have++;
                            }
                        }

                        for (const thing of things) {
                            overallSeen[thing] = true;
                            setSeen.add(thing);
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
                            const hasThing = thing.some((thingId) => userHasFunc(thingId));

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

    private doGeneric<T extends GenericCategory<U>, U>(
        params: DoGenericParameters<T, U>
    ): UserCounts {
        const counts: UserCounts = {};
        const overallData = (counts['OVERALL'] = new UserCount());

        for (const category of params.categories) {
            const categoryUnavailable = category.name.startsWith('Unavailable');
            const availabilityData = (counts[categoryUnavailable ? 'UNAVAILABLE' : 'AVAILABLE'] ||=
                new UserCount());
            const categoryData = (counts[category.name] = new UserCount());

            for (const item of category.items) {
                const userHas = params.haveFunc(item);

                if (categoryUnavailable && params.includeUnavailable !== true && !userHas) {
                    continue;
                }

                const totalCount = params.totalCountFunc?.(item) || 1;
                overallData.total += totalCount;
                availabilityData.total += totalCount;
                categoryData.total += totalCount;

                if (userHas) {
                    const haveCount = params.haveCountFunc?.(item) || 1;
                    overallData.have += haveCount;
                    availabilityData.have += haveCount;
                    categoryData.have += haveCount;
                }
            }
        }

        return counts;
    }
}

export const userState = new UserState();
