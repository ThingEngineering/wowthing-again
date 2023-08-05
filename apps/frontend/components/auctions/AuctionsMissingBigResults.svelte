<script lang="ts">
    import { DateTime } from 'luxon'

    import { timeLeft } from '@/data/auctions'
    import { Region } from '@/enums'
    import { iconLibrary } from '@/icons'
    import { itemStore, staticStore, timeStore } from '@/stores'
    import { auctionState } from '@/stores/local-storage'
    import { userAuctionMissingRecipeStore, userAuctionMissingTransmogStore } from '@/stores/user-auctions'
    import connectedRealmName from '@/utils/connected-realm-name'
    import tippy from '@/utils/tippy'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import Paginate from '@/components/common/Paginate.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'
    import UnderConstruction from '@/components/common/UnderConstruction.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let page: number
    export let slug: string
</script>

<style lang="scss">
    .wrapper {
        align-items: flex-start;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 0.75rem;
    }
    table {
        --padding: 2;

        display: inline-block;
        margin-bottom: 0.5rem;
        width: 23.5rem;
    }
    th {
        background-color: $highlight-background;
        font-weight: normal;
    }
    .item {
        --image-border-width: 1px;
        // --image-margin-top: -4px;

        max-width: 22rem;
        padding: 0.2rem $width-padding;
        text-align: left;

        :global(a) {
            min-width: 0;
        }

        :global(a>.flex-wrapper) {
            justify-content: start;
            gap: 0.4rem;
        }

        :global(.text-overflow) {
            text-align: left;
        }
    }
    .clipboard {
        --image-margin-top: -6px;

        cursor: pointer;
        margin-right: -2px;
    }
    .realm {
        @include cell-width(11.0rem, $paddingLeft: 0px);
    }
    .price {
        @include cell-width(5.5rem);

        text-align: right;
        white-space: nowrap;
    }
    .time-left {
        @include cell-width(4.2rem);

        text-align: right;
        word-spacing: -0.2ch;
    }
    .total-gold {
        margin-left: auto;
        padding-right: 0.5rem;
    }
    // .age-1 {
    //     color: #f8f;
    // }
    .age-2 {
        color: #ff9;
    }
    .age-3 {
        color: #fa5;
    }
    .age-4 {
        color: #f51;
    }
    code {
        color: $body-text;
    }
</style>

<UnderConstruction />

{#await slug === 'missing-recipes'
    ? userAuctionMissingRecipeStore.search($auctionState, $itemStore, $staticStore)
    : userAuctionMissingTransmogStore.search($auctionState, $itemStore, $staticStore, slug.replace('missing-appearance-', ''))
}
    <div class="wrapper">L O A D I N G . . .</div>
{:then [things, updated]}
    <Paginate
        items={(things || [])}
        perPage={$auctionState.limitToCheapestRealm ? 48 : 24}
        {page}
        let:paginated
    >
        <div class="wrapper">
            {#each paginated as item}
                {@const auctions = item.auctions.slice(0, $auctionState.limitToCheapestRealm ? 1 : 5)}
                {@const itemId = auctions[0].itemId}
                <table
                    class="table table-striped"
                >
                    <thead>
                        <tr>
                            <th class="item text-overflow" colspan="3">
                                <div class="flex-wrapper">
                                    <WowheadLink
                                        type={'item'}
                                        id={itemId}
                                        extraParams={{
                                            bonus: (auctions[0].bonusIds || []).join(':')
                                        }}
                                    >
                                        <div class="flex-wrapper">
                                            <WowthingImage
                                                name="item/{itemId}"
                                                size={20}
                                                border={1}
                                            />

                                            <ParsedText
                                                cls="text-overflow"
                                                text={'{' + `item:${itemId}` + '}'}
                                            />
                                        </div>
                                    </WowheadLink>

                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <span
                                        class="clipboard"
                                        use:tippy={"Copy to clipboard"}
                                        on:click={() => navigator.clipboard.writeText($itemStore.items[itemId].name)}
                                    >
                                        <IconifyIcon
                                            icon={iconLibrary.mdiClipboardPlusOutline}
                                            scale={'0.9'}
                                        />
                                    </span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each auctions as auction}
                            {@const connectedRealm = $staticStore.connectedRealms[auction.connectedRealmId]}
                            {@const ageInMinutes = Math.floor(
                                $timeStore.diff(
                                    DateTime.fromSeconds(updated[auction.connectedRealmId])
                                ).toMillis() / 1000 / 60
                            )}
                            <tr>
                                <td
                                    class="realm text-overflow"
                                    use:tippy={{
                                        allowHTML: true,
                                        content: `
${connectedRealm.realmNames.join(' / ')}
<br><br>
Data is ${ageInMinutes} minute(s) old
${ageInMinutes >= 60 ? '- refresh!' : ''}
`
                                    }}
                                >
                                    <code>[{Region[connectedRealm.region]}]</code>
                                    <span
                                        class:age-1={ageInMinutes < 20}
                                        class:age-2={ageInMinutes >= 20 && ageInMinutes < 40}
                                        class:age-3={ageInMinutes >= 40 && ageInMinutes < 60}
                                        class:age-4={ageInMinutes >= 60}
                                    >
                                        {connectedRealmName(auction.connectedRealmId)}
                                    </span>
                                </td>
                                <td class="price">
                                    {#if auction.buyoutPrice < 10000}
                                        &lt;1 g
                                    {:else}
                                        {Math.floor(auction.buyoutPrice / 10000).toLocaleString()} g
                                    {/if}
                                </td>
                                <td
                                    class="time-left"
                                    class:status-fail={auction.timeLeft === 0}
                                    class:status-shrug={auction.timeLeft === 1}
                                    class:status-success={auction.timeLeft > 1}
                                >
                                    {timeLeft[auction.timeLeft]}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {/each}
        </div>

        <div
            slot="bar-end"
            class="total-gold"
            use:tippy={"Total gold required to buy the cheapest of each item"}
        >
            {Math.floor(things.reduce((a, b) => a + b.auctions[0].buyoutPrice, 0) / 10000).toLocaleString()} g
        </div>
    </Paginate>
{/await}