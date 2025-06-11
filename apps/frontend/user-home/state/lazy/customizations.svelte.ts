import { wowthingData } from '@/shared/stores/data';
import { UserCount } from '@/types';
import type { UserCounts } from './types';
import { get } from 'svelte/store';
import { userAchievementStore } from '@/stores';
import { userState } from '../user';

export function doCustomizations(): UserCounts {
    // FIXME: move to state
    const userAchievementData = get(userAchievementStore);

    const counts: UserCounts = {};
    const overallData = (counts['OVERALL'] = new UserCount());

    for (const categories of wowthingData.manual.customizationCategories) {
        const sectionData = (counts[categories[0].slug] = new UserCount());

        for (const category of categories.slice(1)) {
            const categoryKey = `${categories[0].slug}--${category.slug}`;
            const categoryData = (counts[categoryKey] = new UserCount());

            for (const group of category.groups) {
                const groupKey = `${categoryKey}--${group.name}`;
                const groupData = (counts[groupKey] = new UserCount());

                for (const thing of group.things) {
                    overallData.total++;
                    sectionData.total++;
                    categoryData.total++;
                    groupData.total++;

                    if (
                        (thing.achievementId > 0 &&
                            !!userAchievementData.achievements[thing.achievementId]) ||
                        (thing.questId > 0 && userState.quests.accountHasById.has(thing.questId)) ||
                        (thing.spellId > 0 &&
                            userState.general.characters.some((char) =>
                                char.knownSpells?.includes(thing.spellId)
                            )) ||
                        (thing.appearanceModifier >= 0 &&
                            userState.general.hasAppearanceBySource.has(thing.sourceId))
                    ) {
                        overallData.have++;
                        sectionData.have++;
                        categoryData.have++;
                        groupData.have++;
                    }
                }
            }
        }
    }

    return counts;
}
