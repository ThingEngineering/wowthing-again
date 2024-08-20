<script lang="ts">
    import { lazyStore } from '@/stores'
    import type { ManualDataVendorCategory } from '@/types/data/manual'

    import Costs from './VendorsCosts.svelte'
    import Group from './VendorsGroup.svelte'
    import SectionTitle from '@/components/collectible/CollectibleSectionTitle.svelte'

    export let category: ManualDataVendorCategory
    export let costs: Record<number, number>
    export let slug1: string

    $: useV2 = category.groups.length > 3 &&
        category.groups.reduce((a, b) => a + b.sellsFiltered.length, 0) > 30
</script>

<style lang="scss">
    .collection-v2-section {
        column-count: var(--column-count, 1);
        column-gap: 30px;
    }
</style>

<SectionTitle
    title={category.name}
    count={$lazyStore.vendors.stats[`${slug1}--${category.slug}`]}
>
    <Costs {costs} />
</SectionTitle>

<div class="collection{useV2 ? '-v2' : ''}-section">
    {#each category.groups as group}
        {#if group.sellsFiltered.length > 0}
            <Group
                {group}
                {useV2}
            />
        {/if}
    {/each}
</div>
