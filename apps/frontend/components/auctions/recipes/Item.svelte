<script lang="ts">
    import connectedRealmName from '@/utils/connected-realm-name';
    import type { UserAuctionDataAuction } from '@/types/data';
    import type { HasNameAndRealm, UserItem } from '@/types/shared';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import ItemLink from '@/shared/components/links/ItemLink.svelte';

    type Props = {
        auctions: UserAuctionDataAuction[];
        haveItems: [HasNameAndRealm, UserItem[]][];
        itemId: number;
    };
    let { auctions, haveItems, itemId }: Props = $props();

    let totalCount = haveItems.reduce((acc, b) => acc + b[1].length, 0);
</script>

<table class="table table-striped">
    <thead>
        <tr>
            <th colspan="2">
                <ItemLink id={itemId}>
                    <ParsedText text={`{item:${itemId}}`} />
                </ItemLink>
            </th>
            <th>
                {totalCount}
            </th>
        </tr>
    </thead>
    <tbody>
        {#each auctions as auction}
            <tr>
                <td>{connectedRealmName(auction.connectedRealmId)}</td>
                <td>{Math.floor(auction.buyoutPrice / 10_000).toLocaleString()} g</td>
            </tr>
        {/each}
    </tbody>
</table>
