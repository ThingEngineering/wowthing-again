<script lang="ts">
    import { AppearanceModifier } from '@/enums/appearance-modifier';
    import { browserState } from '@/shared/state/browser.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { DbThingType } from '@/shared/stores/db/enums';
    import { thingContentTypeToRewardType } from '@/shared/stores/db/types';
    import { achievementStore } from '@/stores/achievements';
    import { UserCount, type AchievementData } from '@/types';
    import { userState } from '@/user-home/state/user';
    import { applyBonusIds } from '@/utils/items/apply-bonus-ids';
    import { rewardToLookup } from '@/utils/rewards/reward-to-lookup';
    import { snapshotStateForUserHasLookup } from '@/utils/rewards/snapshot-state-for-user-has-lookup.svelte';
    import { userHasLookup } from '@/utils/rewards/user-has-lookup';
    import type { EverythingData } from './data';
    import { SomethingThing } from './types';

    import AchievementCategory from '@/components/achievements/Category.svelte';
    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';
    import VendorsCategories from '@/components/vendors/VendorsCategories.svelte';
    import Thing from './Thing.svelte';
    import { ItemLocation } from '@/enums/item-location';

    let { slug, thing }: { slug: string; thing: EverythingData } = $props();

    let checkCharacters = $derived(
        slug === 'remix-legion' ? userState.general.activeCharacters.filter((c) => c.isRemix) : []
    );
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
                } else {
                    let anyHave = false;

                    for (const character of checkCharacters) {
                        if (
                            Object.values(character.equippedItems).some(
                                (item) => item.itemId === content.id
                            ) ||
                            character.itemsByLocation[ItemLocation.Bags].some(
                                (item) => item.itemId === content.id
                            ) ||
                            character.itemsByLocation[ItemLocation.Bank].some(
                                (item) => item.itemId === content.id
                            )
                        ) {
                            anyHave = true;
                            hasOnCharacterIds.push(character.id);
                        }
                    }

                    if (anyHave) {
                        resultData.remixHave++;
                    }
                }

                if (browserState.current.everything.showCollected || !userHas) {
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

            ret.push(resultData);
        }

        return ret;
    });

    let stats = $derived.by(() => {
        const ret = {
            overall: new UserCount(),
            lfr: new UserCount(),
            normal: new UserCount(),
            heroic: new UserCount(),
            mythic: new UserCount(),
        };
        for (const dbThing of dbThings) {
            ret.overall.have += dbThing.stats.have;
            ret.overall.total += dbThing.stats.total;

            if (dbThing.thing.name.endsWith('- LFR')) {
                ret.lfr.have += dbThing.stats.have;
                ret.lfr.total += dbThing.stats.total;
            } else if (dbThing.thing.name.endsWith('- Normal')) {
                ret.normal.have += dbThing.stats.have;
                ret.normal.total += dbThing.stats.total;
            } else if (dbThing.thing.name.endsWith('- Heroic')) {
                ret.heroic.have += dbThing.stats.have;
                ret.heroic.total += dbThing.stats.total;
            } else if (dbThing.thing.name.endsWith('- Mythic')) {
                ret.mythic.have += dbThing.stats.have;
                ret.mythic.total += dbThing.stats.total;
            }
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
    .drops {
        gap: 1rem 0.3rem;
    }
    .drops-grid {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(3, auto);
    }
    .stats {
        gap: 1rem;
        margin-left: 1rem;

        .difficulty {
            border-left: 1px solid var(--border-color);
            border-right: 1px solid var(--border-color);
            margin-right: -0.3rem;
            padding: 0 calc(var(--padding-size) * 2);
        }
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
            <SectionTitle title="Drops" count={stats.overall}>
                <div class="stats flex-wrapper">
                    {#if stats.lfr.total > 0}
                        <div>
                            <span class="difficulty">LFR</span>
                            <CollectibleCount counts={stats.lfr} />
                        </div>
                    {/if}
                    {#if stats.normal.total > 0}
                        <div>
                            <span class="difficulty">Normal</span>
                            <CollectibleCount counts={stats.normal} />
                        </div>
                    {/if}
                    {#if stats.heroic.total > 0}
                        <div>
                            <span class="difficulty">Heroic</span>
                            <CollectibleCount counts={stats.heroic} />
                        </div>
                    {/if}
                    {#if stats.mythic.total > 0}
                        <div>
                            <span class="difficulty">Mythic</span>
                            <CollectibleCount counts={stats.mythic} />
                        </div>
                    {/if}
                </div>
            </SectionTitle>

            <div class="collection-section drops" class:drops-grid={slug === 'remix-legion'}>
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
