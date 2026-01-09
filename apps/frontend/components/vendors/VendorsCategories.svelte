<script lang="ts">
    import { RewardType } from '@/enums/reward-type';
    import { wowthingData } from '@/shared/stores/data';
    import { lazyState } from '@/user-home/state/lazy';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import type { ParamsSlugsProps } from '@/types/props';

    import Category from './VendorsCategory.svelte';
    import Costs from './VendorsCosts.svelte';
    import Options from './VendorsOptions.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';

    type Props = ParamsSlugsProps & {
        hideOptions?: boolean;
        noV2?: boolean;
        overrideShowCollected?: boolean;
        overrideShowUncollected?: boolean;
        showAll?: boolean;
        titleOverride?: string;
    };
    let {
        hideOptions,
        noV2,
        params,
        showAll,
        overrideShowCollected,
        overrideShowUncollected,
        titleOverride,
    }: Props = $props();

    let firstCategory = $derived.by(() =>
        wowthingData.manual.vendors.sets.find((cat) => cat?.slug === params.slug1)
    );

    let [categories, titles, totalCosts] = $derived.by(() => {
        if (!firstCategory) {
            return [null, null, null];
        }

        // lazyState.vendors also creates groups, take a snapshot now to trigger that
        const userHas = $state.snapshot(lazyState.vendors.userHas);

        const retTitles: string[] = [];
        let retCategories = firstCategory.children.filter((cat) => cat?.groups?.length > 0);
        let retTotalCosts: Record<string, Record<number, number>> = { OVERALL: {} };

        if (params.slug2) {
            retTitles.push(firstCategory.name);
            retCategories = retCategories.filter((cat) => cat?.slug === params.slug2);
        }
        if (params.slug3) {
            retTitles.push(retCategories[0].name);
            retCategories = retCategories[0].children.filter((cat) => cat?.slug === params.slug3);
        }

        for (const category of retCategories) {
            const skipItems = new Set<number>();
            retTotalCosts[category.slug] = {};
            for (const group of category.groups) {
                for (const thing of group.sellsFiltered) {
                    // only count items with oppositeFactionId once for totals
                    if (thing.type === RewardType.Item) {
                        if (skipItems.has(thing.id)) {
                            continue;
                        }

                        const thingItem = wowthingData.items.items[thing.id];
                        if (thingItem?.oppositeFactionId) {
                            skipItems.add(thingItem.oppositeFactionId);
                        }
                    }

                    const has = (userHas[
                        `${thing.type}|${thing.id}|${(thing.bonusIds || []).join(',')}`
                    ] || [false])[0];
                    if (!has) {
                        for (const currency in thing.costs) {
                            retTotalCosts['OVERALL'][currency] =
                                (retTotalCosts['OVERALL'][currency] || 0) + thing.costs[currency];
                            retTotalCosts[category.slug][currency] =
                                (retTotalCosts[category.slug][currency] || 0) +
                                thing.costs[currency];
                        }
                    }
                }
            }
        }

        return [retCategories, retTitles, retTotalCosts];
    });

    let containerElement = $state<HTMLElement>(null);
    let resizeableElement = $state<HTMLElement>(null);
    let debouncedResize: () => void = $derived.by(() => {
        if (resizeableElement) {
            return getColumnResizer(containerElement, resizeableElement, 'collection-v2-group', {
                columnCount: '--column-count',
                gap: 30,
                padding: '0.75rem',
            });
        } else {
            return null;
        }
    });

    $effect(() => debouncedResize?.());
</script>

<style lang="scss">
    .spacer {
        margin-bottom: 0.5rem;
    }
</style>

<svelte:window on:resize={debouncedResize} />

<div class="resizer-view" bind:this={containerElement}>
    {#if !hideOptions}
        <Options />
    {/if}

    <div bind:this={resizeableElement}>
        {#if categories}
            <div class="collection thing-container" bind:this={resizeableElement}>
                {#if firstCategory && !params.slug2}
                    <SectionTitle
                        title={firstCategory.name}
                        count={lazyState.vendors.stats[params.slug1]}
                    >
                        <Costs costs={totalCosts.OVERALL} />
                    </SectionTitle>
                    <div class="spacer"></div>
                {/if}

                {#each categories as category (category)}
                    <Category
                        {category}
                        costs={totalCosts[category.slug]}
                        statsSlug={params.slug3 ? `${params.slug1}--${params.slug2}` : params.slug1}
                        title={titleOverride || titles.concat(category.name).join(' &gt; ')}
                        {noV2}
                        {overrideShowCollected}
                        {overrideShowUncollected}
                        {showAll}
                    />
                {/each}
            </div>
        {/if}
    </div>
</div>
