import { AppearanceModifier } from '@/enums/appearance-modifier';
import { browserState } from '@/shared/state/browser.svelte';
import { settingsState } from '@/shared/state/settings.svelte';
import { wowthingData } from '@/shared/stores/data';
import { DbThingType } from '@/shared/stores/db/enums';
import { thingContentTypeToRewardType } from '@/shared/stores/db/types/thing';
import { UserCount } from '@/types/user-count';
import { everythingData } from '@/user-home/components/everything/data';
import { SomethingThing } from '@/user-home/components/everything/types';
import { applyBonusIds } from '@/utils/items/apply-bonus-ids';
import { rewardToLookup } from '@/utils/rewards/reward-to-lookup';
import { snapshotStateForUserHasLookup } from '@/utils/rewards/snapshot-state-for-user-has-lookup.svelte';
import { userHasLookup } from '@/utils/rewards/user-has-lookup';

class LazyEverythingDrops {
    public stats = {
        overall: new UserCount(),
        lfr: new UserCount(),
        normal: new UserCount(),
        heroic: new UserCount(),
        mythic: new UserCount(),
    };
    public things: SomethingThing[] = [];
}
interface LazyEverything {
    drops: Record<string, LazyEverythingDrops>;
}

export function doEverything(): LazyEverything {
    console.time('doEverything');
    const ret: LazyEverything = {
        drops: {},
    };
    const snapshot = snapshotStateForUserHasLookup();

    for (const [key, something] of Object.entries(everythingData)) {
        const drops = new LazyEverythingDrops();

        const results = wowthingData.db.search({
            tags: [something.tag],
        });
        for (const result of results.filter((result) => result.type !== DbThingType.Vendor)) {
            const resultData = new SomethingThing(result);
            for (const content of result.contents) {
                resultData.stats.total++;

                const [lookupType, lookupId] = rewardToLookup(
                    thingContentTypeToRewardType[content.type],
                    content.id
                );

                // TODO: fix this to handle groups properly, ugh
                let modifier = AppearanceModifier.Normal;
                let quality = -1;
                if (result.groups.length === 1) {
                    if (result.groups[0].overrideDifficulty === 15) {
                        modifier = AppearanceModifier.Heroic;
                    } else if (result.groups[0].overrideDifficulty === 16) {
                        modifier = AppearanceModifier.Mythic;
                    } else if (result.groups[0].overrideDifficulty === 17) {
                        modifier = AppearanceModifier.LookingForRaid;
                    }

                    if (result.groups[0].bonusIds?.length > 0) {
                        const withBonusIds = applyBonusIds(result.groups[0].bonusIds, {});
                        quality = withBonusIds.quality;
                    }
                }

                const userHas = userHasLookup(snapshot, lookupType, lookupId, {
                    completionist: settingsState.value.transmog.completionistMode,
                    modifier,
                });

                let hasOnCharacterIds: number[] = [];
                if (userHas) {
                    resultData.stats.have++;
                }

                const show =
                    (userHas && browserState.current.everything.showCollected) ||
                    (!userHas &&
                        (hasOnCharacterIds.length === 0 ||
                            browserState.current.everything.showTransfers));
                if (show) {
                    resultData.contents.push({
                        originalId: content.id,
                        originalType: content.type,
                        lookupType,
                        lookupId,
                        userHas,
                        quality,
                        hasOnCharacterIds,
                    });
                }
            }

            drops.things.push(resultData);
        } // for results

        ret.drops[key] = drops;

        for (const dbThing of drops.things) {
            drops.stats.overall.have += dbThing.stats.have;
            drops.stats.overall.total += dbThing.stats.total;

            if (dbThing.thing.name.endsWith('- LFR')) {
                drops.stats.lfr.have += dbThing.stats.have;
                drops.stats.lfr.total += dbThing.stats.total;
            } else if (dbThing.thing.name.endsWith('- Normal')) {
                drops.stats.normal.have += dbThing.stats.have;
                drops.stats.normal.total += dbThing.stats.total;
            } else if (dbThing.thing.name.endsWith('- Heroic')) {
                drops.stats.heroic.have += dbThing.stats.have;
                drops.stats.heroic.total += dbThing.stats.total;
            } else if (dbThing.thing.name.endsWith('- Mythic')) {
                drops.stats.mythic.have += dbThing.stats.have;
                drops.stats.mythic.total += dbThing.stats.total;
            }
        }
    } // for everythingData

    // const getAchievementStats = (achievementData: AchievementData) => {
    //     let cat = achievementData.categories.find((cat) => cat?.slug === thing.achievementsKey[0]);
    //     for (let i = 1; i < thing.achievementsKey.length; i++) {
    //         cat = cat.children.find((cat) => cat?.slug === thing.achievementsKey[i]);
    //     }
    //     return userState.achievements.categories[cat?.id];
    // }

    console.timeEnd('doEverything');
    return ret;
}
