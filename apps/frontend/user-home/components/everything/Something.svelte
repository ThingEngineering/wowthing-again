<script lang="ts">
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { DbThingType } from '@/shared/stores/db/enums';
    import { thingContentTypeToRewardType } from '@/shared/stores/db/types';
    import { achievementStore } from '@/stores/achievements';
    import { UserCount } from '@/types';
    import { lazyState } from '@/user-home/state/lazy';
    import { rewardToLookup } from '@/utils/rewards/reward-to-lookup';
    import { snapshotStateForUserHasLookup } from '@/utils/rewards/snapshot-state-for-user-has-lookup.svelte';
    import { userHasLookup } from '@/utils/rewards/user-has-lookup';
    import type { EverythingData } from './data';
    import { SomethingThing } from './types';

    import AchievementCategory from '@/components/achievements/Category.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';
    import VendorsCategories from '@/components/vendors/VendorsCategories.svelte';
    import Thing from './Thing.svelte';

    let { thing }: { thing: EverythingData } = $props();

    let snapshot = $derived.by(() => snapshotStateForUserHasLookup());
    let dbThings = $derived.by(() => {
        const ret: SomethingThing[] = [];

        const results = wowthingData.db.search({
            tags: [thing.tag],
        });

        for (const result of results.filter((result) => result.type !== DbThingType.Vendor)) {
            const resultData = new SomethingThing(result);
            for (const content of result.contents) {
                resultData.stats.total++;

                const [lookupType, lookupId] = rewardToLookup(
                    thingContentTypeToRewardType[content.type],
                    content.id
                );

                const userHas = userHasLookup(snapshot, lookupType, lookupId, {});

                resultData.contents.push({
                    originalId: content.id,
                    originalType: content.type,
                    lookupType,
                    lookupId,
                    userHas,
                });
                if (userHas) {
                    resultData.stats.have++;
                }
            }

            ret.push(resultData);
        }

        return ret;
    });
    let totalStats = $derived.by(() => {
        const ret = new UserCount();
        for (const dbThing of dbThings) {
            ret.have += dbThing.stats.have;
            ret.total += dbThing.stats.total;
        }
        return ret;
    });
</script>

<style lang="scss">
    .achievements {
        padding: 0.7rem 0.7rem 0.2rem 0.7rem;
    }
</style>

<div class="wrapper-column">
    <h2>{thing.name}</h2>

    {#if dbThings.length > 0}
        <div class="collection thing-container">
            <SectionTitle title="Drops" count={totalStats}></SectionTitle>

            <div class="collection-section">
                {#each dbThings as dbThing}
                    <Thing thingData={dbThing} />
                {/each}
            </div>
        </div>
    {/if}

    {#if thing.vendorsKey}
        {@const vendorParams = {
            slug1: thing.vendorsKey[0],
            slug2: thing.vendorsKey[1],
            slug3: thing.vendorsKey[2],
        }}
        <VendorsCategories
            params={vendorParams}
            hideOptions={true}
            noV2={true}
            showAll={true}
            titleOverride="Vendors"
        />
    {/if}

    {#if thing.achievementsKey}
        {#await achievementStore.fetch({ language: settingsState.value.general.language }) then}
            <div class="collection thing-container">
                <SectionTitle title="Achievements"></SectionTitle>

                <div class="achievements">
                    <AchievementCategory
                        everythingSort={true}
                        hideOptions={true}
                        slug1={thing.achievementsKey[0]}
                        slug2={thing.achievementsKey[1]}
                    />
                </div>
            </div>
        {/await}
    {/if}
</div>
