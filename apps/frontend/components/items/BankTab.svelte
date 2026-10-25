<script lang="ts">
    import { Constants } from '@/data/constants';
    import type { groupBankItems } from '@/utils/items/group-bank-items';

    import Empty from '@/components/items/ItemsEmpty.svelte';
    import Item from '@/components/items/ItemsItem.svelte';

    type Props = {
        groupedItems: ReturnType<typeof groupBankItems>;
        tab: number;
        tabIndexOffByOne?: boolean;
    };

    let { groupedItems, tab, tabIndexOffByOne }: Props = $props();

    let items = $derived(groupedItems[tabIndexOffByOne ? tab - 1 : tab] || []);
</script>

<style lang="scss">
    .collection-v2-section {
        width: calc((48px * 14) + (0.04rem * 13) + (0.75rem * 2));
    }
    .collection-objects {
        --item-empty-border: var(--border-color);

        flex-flow: column wrap;
        gap: 0.04rem;
        height: calc((48px * 7) + (0.04rem * 6));
    }
</style>

<div class="collection-v2-section">
    <div class="collection-v2-group">
        <h4>
            Tab {tab}
            <span class="slot-count">
                ( {items.filter((i) => !!i).length} / {Constants.bankTabItems} )
            </span>
        </h4>
        <div class="collection-objects">
            {#each items as item}
                {#if item}
                    <Item gear={{ equipped: item }} useItemCount={true} />
                {:else}
                    <Empty />
                {/if}
            {/each}
        </div>
    </div>
</div>
