<script lang="ts">
    import { DateTime } from 'luxon'
    import some from 'lodash/some'

    import { timeLeft } from '@/data/auctions'
    import { Region } from '@/enums'
    import { iconLibrary } from '@/icons'
    import { itemStore, settingsStore, staticStore, timeStore, userStore } from '@/stores'
    import { auctionState } from '@/stores/local-storage'
    import { userAuctionMissingRecipeStore, userAuctionMissingTransmogStore, type UserAuctionEntry } from '@/stores/user-auctions'
    import connectedRealmName from '@/utils/connected-realm-name'
    import tippy, { tippyComponent } from '@/utils/tippy'
    import type { HasNameAndRealm, UserItem } from '@/types/shared'

    import IconifyIcon from '@/components/images/IconifyIcon.svelte'
    import Paginate from '@/components/common/Paginate.svelte'
    import ParsedText from '@/components/common/ParsedText.svelte'
    import TooltipAlreadyHave from '@/components/tooltips/auction-already-have/TooltipAuctionAlreadyHave.svelte'
    import UnderConstruction from '@/components/common/UnderConstruction.svelte'
    import WowheadLink from '@/components/links/WowheadLink.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let page: number
    export let slug: string

    function setRealmSearch(connectedRealmId: number) {
        const realmName = $staticStore.connectedRealms[connectedRealmId].realmNames[0]
        if (slug === 'missing-recipes') {
            $auctionState.missingRecipeRealmSearch = realmName
        }
        else {
            $auctionState.missingTransmogRealmSearch = realmName
        }
    }
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

        border-collapse: collapse;
        display: inline-block;
        margin-bottom: 0.5rem;
        width: 23.5rem;

        &.faded {
            opacity: 0.6;
        }
    }
    th {
        background-color: $highlight-background;
        font-weight: normal;
    }
    .filter-highlight {
        td {
            background: rgba(0, 255, 255, 0.13);
        }
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
    .icons {
        --image-margin-top: -5px;

        margin-left: auto;
    }
    .already-have {
        color: $colour-fail;
    }
    .clipboard {
        cursor: pointer;
        margin-right: -2px;
    }
    .realm {
        @include cell-width(11.0rem, $paddingLeft: 0px);

        cursor: pointer;
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
    ? userAuctionMissingRecipeStore.search(
        $auctionState,
        $itemStore,
        $staticStore,
        $userStore
    )
    : userAuctionMissingTransmogStore.search(
        $settingsStore,
        $auctionState,
        $itemStore,
        $staticStore,
        $userStore,
        slug.replace('missing-appearance-', '')
    )
}
    <div class="wrapper">L O A D I N G . . .</div>
{:then [things, updated]}
    {#if things.length > 0}
        {@const realmSearch = (slug === 'missing-recipes'
            ? $auctionState.missingRecipeRealmSearch
            : $auctionState.missingTransmogRealmSearch).toLocaleLowerCase()}
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
                        class:faded={item.hasItems.length > 0}
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

                                        <span class="icons">
                                            {#if item.hasItems.length > 0}
                                                <span
                                                    class="already-have"
                                                    use:tippyComponent={{
                                                        component: TooltipAlreadyHave,
                                                        props: {
                                                            hasItems: item.hasItems,
                                                        },
                                                    }}
                                                >
                                                    <IconifyIcon
                                                        icon={iconLibrary.mdiAlertOutline}
                                                        scale={'0.9'}
                                                    />
                                                </span>
                                            {:else}
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
                                            {/if}
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
                                <tr
                                    class:filter-highlight={realmSearch
                                        && !$auctionState.limitToCheapestRealm
                                        && some(
                                            connectedRealm.realmNames,
                                            (name) => name.toLocaleLowerCase().indexOf(realmSearch) >= 0
                                        )
                                    }
                                >
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
                                            on:click={() => setRealmSearch(auction.connectedRealmId)}
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
    {:else}
        <div class="wrapper">
            <div>No results!</div>
        </div>
    {/if}
{/await}
