import { settingsState } from '@/shared/state/settings.svelte';
import { browserState, type CollectibleState } from '@/shared/state/browser.svelte';
import { Character, UserCount } from '@/types';
import {
    ManualDataSetCategory,
    ManualDataSetGroup,
    type ManualDataSetGroupArray,
} from '@/types/data/manual';
import { wowthingData } from '@/shared/stores/data';
import { expansionMap, expansionOrder } from '@/data/expansion';
import { Constants } from '@/data/constants';

interface UserCollectible {
    filteredCategories: ManualDataSetCategory[][];
    stats: Record<string, UserCount>;
}
class UserRecipes {
    public abilitySpells: Record<number, number[]> = {};
    public hasAbility: Record<number, boolean[]> = {};
    public stats: Record<string, UserCount> = {};
}

export class DataUserDerived {
    public doCollectible(
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

    public doRecipes(allCharacters: Character[]) {
        console.time('doRecipes');

        const ret = new UserRecipes();

        const overallData = (ret.stats['OVERALL'] = new UserCount());

        for (const profession of wowthingData.static.professionById.values()) {
            const professionKey = profession.slug;
            const professionData = (ret.stats[professionKey] = new UserCount());

            const allKnown = new Set<number>();
            const collectorIds =
                settingsState.value.professions.collectingCharactersV2?.[profession.id];
            const characters =
                collectorIds?.length > 0
                    ? collectorIds.map((collectorId) =>
                          allCharacters.find((c) => c.id === collectorId)
                      )
                    : allCharacters;
            for (const character of characters || []) {
                for (const recipeId of character?.professions?.[profession.id]?.knownRecipes ||
                    []) {
                    allKnown.add(recipeId);
                }
            }

            const categories = profession.categories || [];
            for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
                const category = categories[categoryIndex];
                if (!category.children[0]?.children) {
                    continue;
                }

                if (categoryIndex >= expansionOrder.length) {
                    console.warn(
                        'Uhhhh this profession category has no expansion?',
                        profession,
                        categoryIndex
                    );
                    continue;
                }

                const expansionSlug = expansionMap[categoryIndex].slug;

                const categoryKey = `${professionKey}--${expansionSlug}`;
                const categoryData = (ret.stats[categoryKey] = new UserCount());

                const expansionKey = `expansion--${expansionSlug}`;
                const expansionData = (ret.stats[expansionKey] ||= new UserCount());

                for (const child of category.children[0].children) {
                    const childKey = `${categoryKey}--${child.id}`;
                    const childData = (ret.stats[childKey] = new UserCount());

                    for (const ability of child.abilities) {
                        const abilityIds = [
                            ability.id,
                            ...(ability.extraRanks || []).map(([abilityId]) => abilityId),
                        ];
                        ret.abilitySpells[ability.id] = [
                            ability.spellId,
                            ...(ability.extraRanks || []).map(([, spellId]) => spellId),
                        ];
                        // a multi-rank ability is collected if you know that specific rank OR
                        // any higher rank
                        ret.hasAbility[ability.id] = abilityIds.map((_, index) =>
                            abilityIds.slice(index).some((abilityId) => allKnown.has(abilityId))
                        );

                        const abilityCount = abilityIds.length;
                        const abilityHave = ret.hasAbility[ability.id].filter(
                            (have) => have
                        ).length;

                        if (
                            !settingsState.value.collections.hideFuture ||
                            categoryIndex <= Constants.expansion
                        ) {
                            overallData.total += abilityCount;
                            overallData.have += abilityHave;

                            professionData.total += abilityCount;
                            professionData.have += abilityHave;
                        }

                        expansionData.total += abilityCount;
                        expansionData.have += abilityHave;

                        categoryData.total += abilityCount;
                        categoryData.have += abilityHave;

                        childData.total += abilityCount;
                        childData.have += abilityHave;
                    }
                }
            }
        }

        console.timeEnd('doRecipes');

        return ret;
    }
}
