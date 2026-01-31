import { wowthingData } from '@/shared/stores/data';
import { UserCount } from '@/types';
import type { UserCounts } from './types';
import { userState } from '../user';

export function doDecor(): UserCounts {
    const counts: UserCounts = {};
    const overallData = (counts['OVERALL'] = new UserCount());

    const overallSeen = new Set<number>();

    for (const category of wowthingData.static.decorCategories) {
        const categoryKey = category.slug;
        const categoryData = (counts[categoryKey] = new UserCount());
        const categorySeen = new Set<number>();

        for (const subCategory of category.subCategories) {
            const subCategoryKey = `${categoryKey}--${subCategory.slug}`;
            const subCategoryData = (counts[subCategoryKey] = new UserCount());

            for (const decorObject of subCategory.objects) {
                if (decorObject.itemId && !wowthingData.items.items[decorObject.itemId]) {
                    continue;
                }

                if (!overallSeen.has(decorObject.id)) {
                    overallData.total++;
                }
                if (!categorySeen.has(decorObject.id)) {
                    categoryData.total++;
                }
                subCategoryData.total++;

                const decorCounts = userState.general.decor?.[decorObject.id] || [0, 0];
                const decorTotal = decorCounts.reduce((a, b) => a + b, 0);
                if (decorTotal > 0) {
                    if (!overallSeen.has(decorObject.id)) {
                        overallData.have++;
                    }
                    if (!categorySeen.has(decorObject.id)) {
                        categoryData.have++;
                    }
                    subCategoryData.have++;
                }

                overallSeen.add(decorObject.id);
                categorySeen.add(decorObject.id);
            }
        }
    }

    return counts;
}
