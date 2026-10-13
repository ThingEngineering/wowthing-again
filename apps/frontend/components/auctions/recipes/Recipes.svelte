<script lang="ts">
    import sortBy from 'lodash/sortBy';

    import { Region } from '@/enums/region';
    import { userState } from '@/user-home/state/user';
    import { getNumberKeyedEntries } from '@/utils/get-number-keyed-entries';
    import type { UserAuctionDataAuction } from '@/types/data';
    import type { HasNameAndRealm, UserItem } from '@/types/shared';

    import { recipesAuctionStore, type RecipesData } from './store';
    import Item from './Item.svelte';

    type ProcessedAuctions = [number, UserAuctionDataAuction[], [HasNameAndRealm, UserItem[]][]][];
    function processAuctions(auctions: RecipesData): ProcessedAuctions {
        const ret: ProcessedAuctions = [];
        const regionId = userState.general.allRegions[0] || Region.US;

        for (const [itemId, itemAuctions] of getNumberKeyedEntries(auctions[regionId])) {
            // NOTE: this assumes that recipe items aren't soulbound if they can be listed on the AH
            const haveItems = userState.general.itemsById[itemId] || [];
            if (haveItems.length === 0) {
                continue;
            }

            ret.push([itemId, itemAuctions, haveItems]);
        }

        ret.sort((a, b) => b[1][0].buyoutPrice - a[1][0].buyoutPrice);
        console.log(ret);

        return ret;
    }
</script>

{#await recipesAuctionStore.fetch()}
    MOO
{:then auctions}
    {@const haveData = processAuctions(auctions)}
    {#each haveData as [itemId, auctions, haveItems]}
        <Item {auctions} {haveItems} {itemId} />
    {/each}
{/await}
