import { Constants } from '@/data/constants';
import { expansionOrder, maxExpansionId } from '@/data/expansion';
import { UserCount } from '@/types';
import type { StaticData } from '@/shared/stores/static/types';
import type { UserData } from '@/types';

export class LazyRecipes {
    public hasAbility: Record<number, boolean[]> = {};
    public stats: Record<string, UserCount> = {};
}

interface LazyStores {
    staticData: StaticData;
    userData: UserData;
}

export function doRecipes(stores: LazyStores): LazyRecipes {
    console.time('doRecipes');

    const ret = new LazyRecipes();

    const overallData = (ret.stats['OVERALL'] = new UserCount());

    for (const profession of Object.values(stores.staticData.professions)) {
        const professionKey = profession.slug;
        const professionData = (ret.stats[professionKey] = new UserCount());

        const allKnown = new Set<number>();
        for (const character of stores.userData.characters) {
            for (const subProfession of Object.values(
                character.professions?.[profession.id] || {},
            )) {
                for (const recipeId of subProfession.knownRecipes || []) {
                    allKnown.add(recipeId);
                }
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
                    categoryIndex,
                );
                continue;
            }

            const categoryKey = `${professionKey}--${expansionOrder[maxExpansionId - categoryIndex].slug}`;
            const categoryData = (ret.stats[categoryKey] = new UserCount());

            for (const child of category.children[0].children) {
                const childKey = `${categoryKey}--${child.id}`;
                const childData = (ret.stats[childKey] = new UserCount());

                for (const ability of child.abilities) {
                    const abilityIds = [
                        ability.id,
                        ...(ability.extraRanks || []).map(([abilityId]) => abilityId),
                    ];
                    // a multi-rank ability is collected if you know that specific rank OR
                    // any higher rank
                    ret.hasAbility[ability.id] = abilityIds.map((_, index) =>
                        abilityIds.slice(index).some((abilityId) => allKnown.has(abilityId)),
                    );

                    const abilityCount = abilityIds.length;
                    const abilityHave = ret.hasAbility[ability.id].filter((have) => have).length;

                    if (categoryIndex <= Constants.expansion) {
                        overallData.total += abilityCount;
                        overallData.have += abilityHave;

                        professionData.total += abilityCount;
                        professionData.have += abilityHave;
                    }

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
