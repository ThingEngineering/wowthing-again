<script lang="ts">
    import { lazyState } from '@/user-home/state/lazy';
    import type { ManualDataVendorCategory } from '@/types/data/manual';

    import Costs from './VendorsCosts.svelte';
    import Group from './VendorsGroup.svelte';
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte';

    type Props = {
        category: ManualDataVendorCategory;
        costs: Record<number, number>;
        statsSlug: string;
        title: string;
    };
    let { category, costs, statsSlug, title }: Props = $props();

    console.log(category);

    let useV2 = $derived(
        category.groups.length > 3 &&
            category.groups.reduce((a, b) => a + b.sellsFiltered.length, 0) > 30
    );
</script>

<style lang="scss">
    .collection-v2-section {
        column-count: var(--column-count, 1);
        column-gap: 30px;
    }
</style>

<SectionTitle {title} count={lazyState.vendors.stats[`${statsSlug}--${category.slug}`]}>
    <Costs {costs} />
</SectionTitle>

<div class="collection{useV2 ? '-v2' : ''}-section">
    {#each category.groups as group}
        <Group {group} {useV2} />
    {/each}
</div>
