<script lang="ts">
    import { afterUpdate } from 'svelte';

    import { RewardType } from '@/enums/reward-type';
    import { itemStore, lazyStore } from '@/stores';
    import { getColumnResizer } from '@/utils/get-column-resizer';
    import type { MultiSlugParams } from '@/types';
    import type { ManualDataVendorCategory } from '@/types/data/manual';

    import Category from './VendorsCategory.svelte';
    import Costs from './VendorsCosts.svelte';
    import Options from './VendorsOptions.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';
    import { wowthingData } from '@/shared/stores/data';

    export let params: MultiSlugParams;

    let categories: ManualDataVendorCategory[];
    let firstCategory: ManualDataVendorCategory;
    let titles: string[];
    let totalCosts: Record<string, Record<number, number>>;
    $: {
        firstCategory = wowthingData.manual.vendors.sets.find((cat) => cat?.slug === params.slug1);
        if (!firstCategory) {
            break $;
        }

        titles = [];
        categories = firstCategory.children.filter((cat) => cat?.groups?.length > 0);

        if (params.slug2) {
            titles.push(firstCategory.name);
            categories = categories.filter((cat) => cat.slug === params.slug2);
        }
        if (params.slug3) {
            titles.push(categories[0].name);
            categories = categories[0].children.filter((cat) => cat.slug === params.slug3);
        }

        totalCosts = { OVERALL: {} };
        for (const category of categories) {
            const skipItems = new Set<number>();
            totalCosts[category.slug] = {};
            for (const group of category.groups) {
                for (const thing of group.sellsFiltered) {
                    // only count items with oppositeFactionId once for totals
                    if (thing.type === RewardType.Item) {
                        if (skipItems.has(thing.id)) {
                            continue;
                        }

                        const thingItem = $itemStore.items[thing.id];
                        if (thingItem?.oppositeFactionId) {
                            skipItems.add(thingItem.oppositeFactionId);
                        }
                    }

                    if (
                        !$lazyStore.vendors.userHas[
                            `${thing.type}|${thing.id}|${(thing.bonusIds || []).join(',')}`
                        ]
                    ) {
                        for (const currency in thing.costs) {
                            totalCosts['OVERALL'][currency] =
                                (totalCosts['OVERALL'][currency] || 0) + thing.costs[currency];
                            totalCosts[category.slug][currency] =
                                (totalCosts[category.slug][currency] || 0) + thing.costs[currency];
                        }
                    }
                }
            }
        }
    }

    let containerElement: HTMLElement;
    let resizeableElement: HTMLElement;
    let debouncedResize: () => void;
    $: {
        if (resizeableElement) {
            debouncedResize = getColumnResizer(
                containerElement,
                resizeableElement,
                'collection-v2-group',
                {
                    columnCount: '--column-count',
                    gap: 30,
                    padding: '0.75rem',
                },
            );
            debouncedResize();
        } else {
            debouncedResize = null;
        }
    }

    afterUpdate(() => debouncedResize?.());
</script>

<style lang="scss">
    .spacer {
        margin-bottom: 0.5rem;
    }
</style>

<svelte:window on:resize={debouncedResize} />

<div class="resizer-view" bind:this={containerElement}>
    <Options />
    <div bind:this={resizeableElement}>
        {#if categories}
            <div class="collection thing-container" bind:this={resizeableElement}>
                {#if firstCategory && !params.slug2}
                    <SectionTitle
                        title={firstCategory.name}
                        count={$lazyStore.vendors.stats[params.slug1]}
                    >
                        <Costs costs={totalCosts.OVERALL} />
                    </SectionTitle>
                    <div class="spacer"></div>
                {/if}

                {#each categories as category}
                    <Category
                        {category}
                        costs={totalCosts[category.slug]}
                        statsSlug={params.slug3 ? `${params.slug1}--${params.slug2}` : params.slug1}
                        title={titles.concat(category.name).join(' &gt; ')}
                    />
                {/each}
            </div>
        {/if}
    </div>
</div>
