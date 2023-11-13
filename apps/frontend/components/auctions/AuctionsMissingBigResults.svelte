<script lang="ts">
    import { DateTime } from 'luxon'
    import some from 'lodash/some'
    import { replace } from 'svelte-spa-router'

    import { timeLeft } from '@/data/auctions'
    import { Faction } from '@/enums/faction'
    import { Region } from '@/enums/region'
    import { iconLibrary } from '@/shared/icons'
    import { itemStore, timeStore, userStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { auctionState } from '@/stores/local-storage'
    import { userAuctionMissingRecipeStore, userAuctionMissingTransmogStore } from '@/stores/user-auctions'
    import { settingsStore } from '@/shared/stores/settings'
    import connectedRealmName from '@/utils/connected-realm-name'
    import { basicTooltip,  componentTooltip } from '@/shared/utils/tooltips'

    import FactionIcon from '@/shared/components/images/FactionIcon.svelte'
    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte'
    import Paginate from '@/shared/components/paginate/Paginate.svelte'
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import TooltipAlreadyHave from '@/components/tooltips/auction-already-have/TooltipAuctionAlreadyHave.svelte'
    import UnderConstruction from '@/shared/components/under-construction/UnderConstruction.svelte'
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let page: number
    export let slug1: string

    function setRealmSearch(connectedRealmId: number) {
        const realmName = $staticStore.connectedRealms[connectedRealmId].realmNames[0]
        if (slug1 === 'missing-recipes') {
            $auctionState.missingRecipeRealmSearch = realmName
        }
        else {
            $auctionState.missingTransmogRealmSearch = realmName
        }
    }

    let recipeRealmSearch = ''
    let transmogRealmSearch = ''
    $: {
        if (slug1.startsWith('missing-appearance-') && $auctionState.missingTransmogRealmSearch !== transmogRealmSearch) {
            transmogRealmSearch = $auctionState.missingTransmogRealmSearch
            if (page !== 1) {
                replace(`/auctions/${slug1}/1`)
            }
        }
        else if (slug1 === 'missing-recipes' && $auctionState.missingRecipeRealmSearch !== recipeRealmSearch) {
            recipeRealmSearch = $auctionState.missingRecipeRealmSearch
            if (page !== 1) {
                replace(`/auctions/${slug1}/1`)
            }
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
        color: $color-fail;
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
    .item-name-wrapper {
        :global(img + img) {
            margin-left: -0.2rem;
        }
    }
</style>

<UnderConstruction />

{#await slug1 === 'missing-recipes'
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
        slug1.replace('missing-appearance-', '')
    )
}
    <div class="wrapper">L O A D I N G . . .</div>
{:then [things, updated]}
    {#if things.length > 0}
        {@const realmSearch = (slug1 === 'missing-recipes'
            ? $auctionState.missingRecipeRealmSearch
            : $auctionState.missingTransmogRealmSearch).toLocaleLowerCase()}
        <Paginate
            items={(things || [])}
            perPage={$auctionState.limitToCheapestRealm ? 48 : 24}
            {page}
            let:paginated
        >
            <div class="wrapper">
                {#each paginated as result}
                    {@const auctions = result.auctions.slice(0, $auctionState.limitToCheapestRealm ? 1 : 5)}
                    {@const itemId = auctions[0].itemId}
                    {@const item = $itemStore.items[itemId]}
                    <table
                        class="table table-striped"
                        class:faded={result.hasItems.length > 0}
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
                                            <div class="flex-wrapper item-name-wrapper">
                                                {#if item.allianceOnly}
                                                    <FactionIcon faction={Faction.Alliance} />
                                                {:else if item.hordeOnly}
                                                    <FactionIcon faction={Faction.Horde} />
                                                {/if}

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
                                            {#if result.hasItems.length > 0}
                                                <span
                                                    class="already-have"
                                                    use:componentTooltip={{
                                                        component: TooltipAlreadyHave,
                                                        props: {
                                                            hasItems: result.hasItems,
                                                        },
                                                    }}
                                                >
                                                    <IconifyIcon
                                                        icon={iconLibrary.mdiAlertOutline}
                                                        scale={'0.9'}
                                                    />
                                                </span>
                                            {:else}
                                                <button
                                                    class="clipboard"
                                                    use:basicTooltip={"Copy to clipboard"}
                                                    on:click={() => navigator.clipboard.writeText(item.name)}
                                                >
                                                    <IconifyIcon
                                                        icon={iconLibrary.mdiClipboardPlusOutline}
                                                        scale={'0.9'}
                                                    />
                                                </button>
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
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <td
                                        class="realm text-overflow"
                                        on:click={() => setRealmSearch(auction.connectedRealmId)}
                                        use:basicTooltip={{
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
                use:basicTooltip={"Total gold required to buy the cheapest of each item"}
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
