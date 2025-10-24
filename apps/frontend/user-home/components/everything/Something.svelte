<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { DbThingType } from '@/shared/stores/db/enums';
    import { thingContentTypeToRewardType } from '@/shared/stores/db/types';
    import { achievementStore } from '@/stores/achievements';
    import { UserCount, type AchievementData } from '@/types';
    import { rewardToLookup } from '@/utils/rewards/reward-to-lookup';
    import { snapshotStateForUserHasLookup } from '@/utils/rewards/snapshot-state-for-user-has-lookup.svelte';
    import { userHasLookup } from '@/utils/rewards/user-has-lookup';
    import type { EverythingData } from './data';
    import { SomethingThing } from './types';

    import AchievementCategory from '@/components/achievements/Category.svelte';
    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';
    import VendorsCategories from '@/components/vendors/VendorsCategories.svelte';
    import Thing from './Thing.svelte';
    import { userState } from '@/user-home/state/user';

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

                const userHas = userHasLookup(snapshot, lookupType, lookupId, {
                    completionist: settingsState.value.transmog.completionistMode,
                });

                if (userHas) {
                    resultData.stats.have++;
                }

                if (browserState.current.everything.showCollected || !userHas) {
                    resultData.contents.push({
                        originalId: content.id,
                        originalType: content.type,
                        lookupType,
                        lookupId,
                        userHas,
                    });
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

    const getAchievementStats = (achievementData: AchievementData) => {
        let cat = achievementData.categories.find((cat) => cat?.slug === thing.achievementsKey[0]);
        for (let i = 1; i < thing.achievementsKey.length; i++) {
            cat = cat.children.find((cat) => cat?.slug === thing.achievementsKey[i]);
        }
        return userState.achievements.categories[cat?.id];
    };
</script>

<style lang="scss">
    .achievements {
        padding: 0.7rem 0.7rem 0.2rem 0.7rem;
    }
    .title {
        justify-content: flex-start;
    }
    .options-container {
        margin-bottom: 0;
        margin-left: 1rem;
    }
</style>

<div class="wrapper-column">
    <div class="flex-wrapper title">
        <h2>{thing.name}</h2>

        <div class="options-container">
            <span>Show:</span>

            <button>
                <CheckboxInput
                    name="show_collected"
                    bind:value={browserState.current.everything.showCollected}
                    >Collected</CheckboxInput
                >
            </button>
        </div>
    </div>

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
            overrideShowCollected={browserState.current.everything.showCollected}
            overrideShowUncollected={true}
            showAll={browserState.current.everything.showCollected}
            titleOverride="Vendors"
        />
    {/if}

    {#if thing.achievementsKey}
        {#await achievementStore.fetch({ language: settingsState.value.general.language }) then}
            {@const achievementStats = getAchievementStats($achievementStore)}
            <div class="collection thing-container">
                <SectionTitle title="Achievements" count={achievementStats}></SectionTitle>

                <div class="achievements">
                    <AchievementCategory
                        everythingSort={true}
                        hideOptions={true}
                        overrideShowCollected={browserState.current.everything.showCollected}
                        overrideShowUncollected={true}
                        recursive={true}
                        slug1={thing.achievementsKey[0]}
                        slug2={thing.achievementsKey[1]}
                    />
                </div>
            </div>
        {/await}
    {/if}
</div>
