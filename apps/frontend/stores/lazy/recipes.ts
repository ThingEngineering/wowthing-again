import { Constants } from '@/data/constants';
import { expansionOrder } from '@/data/expansion';
import { UserCount } from '@/types';
import type { StaticData } from '@/shared/stores/static/types';
import type { UserData } from '@/types';

interface LazyStores {
    staticData: StaticData;
    userData: UserData;
}

export function doRecipes(stores: LazyStores): Record<string, UserCount> {
    console.time('doRecipes');

    const ret: Record<string, UserCount> = {};

    const overallData = (ret['OVERALL'] = new UserCount());

    for (const profession of Object.values(stores.staticData.professions)) {
        const professionKey = profession.slug;
        const professionData = (ret[professionKey] = new UserCount());

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

            const categoryKey = `${professionKey}--${expansionOrder[Constants.expansion - categoryIndex].slug}`;
            const categoryData = (ret[categoryKey] = new UserCount());

            for (const child of category.children[0].children) {
                const childKey = `${categoryKey}--${child.id}`;
                const childData = (ret[childKey] = new UserCount());

                for (const ability of child.abilities) {
                    overallData.total++;
                    professionData.total++;
                    categoryData.total++;
                    childData.total++;

                    if (allKnown.has(ability.id)) {
                        overallData.have++;
                        professionData.have++;
                        categoryData.have++;
                        childData.have++;
                    }
                }
            }
        }
    }

    console.timeEnd('doRecipes');

    return ret;
}
