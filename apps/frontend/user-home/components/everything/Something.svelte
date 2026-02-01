<script lang="ts">
    import { browserState } from '@/shared/state/browser.svelte';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { achievementStore } from '@/stores/achievements';
    import { lazyState } from '@/user-home/state/lazy';
    import { userState } from '@/user-home/state/user';
    import type { AchievementData } from '@/types';
    import type { EverythingData } from './data';

    import AchievementCategory from '@/components/achievements/Category.svelte';
    import CheckboxInput from '@/shared/components/forms/CheckboxInput.svelte';
    import CollectibleCount from '@/components/collectible/CollectibleCount.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';
    import Thing from './Thing.svelte';
    import VendorsCategories from '@/components/vendors/VendorsCategories.svelte';

    let { slug, thing }: { slug: string; thing: EverythingData } = $props();

    let { things: dbThings, stats } = $derived(lazyState.everything.drops[slug]);

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
        grid-template-rows: repeat(4, auto);
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

            {#if slug === 'remix-legion'}
                <button>
                    <CheckboxInput
                        name="show_transfers"
                        bind:value={browserState.current.everything.showTransfers}
                        >Transferrable</CheckboxInput
                    >
                </button>
            {/if}
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
    {/if}
</div>
