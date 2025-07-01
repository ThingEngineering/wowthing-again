<script lang="ts">
    import keyBy from 'lodash/keyBy';

    import { Constants } from '@/data/constants';
    import type { Guild, GuildItem } from '@/types';

    import Empty from '@/components/items/ItemsEmpty.svelte';
    import Item from '@/components/items/ItemsItem.svelte';

    export let guild: Guild;
    export let tab: number;

    let items: GuildItem[];
    $: {
        const itemBySlot = keyBy(
            guild.items.filter((item) => item.tabId === tab),
            (item) => item.slot
        );

        items = [];
        for (let i = 0; i < Constants.guildBankTabItems; i++) {
            items.push(itemBySlot[i + 1]);
        }
    }
</script>

<style lang="scss">
    .collection-v2-section {
        width: calc((46px * 14) + (0.04rem * 13) + (0.75rem * 2));
    }
    .collection-objects {
        --item-empty-border: var(--border-color);

        flex-flow: column wrap;
        gap: 0.04rem;
        height: calc((46px * 7) + (0.04rem * 6));
    }
</style>

<div class="collection-v2-section">
    <div class="collection-v2-group">
        <h4>
            Tab {tab}
            <span class="slot-count">
                ( {items.filter((i) => !!i).length} / {Constants.guildBankTabItems} )
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
