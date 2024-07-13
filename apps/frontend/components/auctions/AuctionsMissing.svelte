<script lang="ts">
    import { DateTime } from 'luxon'
    import { afterUpdate } from 'svelte'

    import { timeLeft } from '@/data/auctions'
    import { Region } from '@/enums/region'
    import { userAuctionMissingStore } from '@/stores'
    import { staticStore } from '@/shared/stores/static'
    import { timeStore } from '@/shared/stores/time'
    import { auctionState } from '@/stores/local-storage/auctions'
    import connectedRealmName from '@/utils/connected-realm-name'
    import { getColumnResizer } from '@/utils/get-column-resizer'
    import { basicTooltip, componentTooltip } from '@/shared/utils/tooltips'

    import Paginate from '@/shared/components/paginate/Paginate.svelte'
    import RealmTooltip from './RealmTooltip.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let auctionsContainer: HTMLElement
    export let page: number
    export let slug1: string

    let searchType: string
    let thingType: string
    $: {
        searchType = slug1.replace('missing-', '')
        if (slug1 === 'missing-mounts') {
            thingType = 'spell'
        }
        else if (slug1 === 'missing-pets') {
            thingType = 'npc'
        }
        else if (slug1 === 'missing-toys') {
            thingType = 'item'
        }
    }

    const ignoreClick = function(id: string): void {
        const ignored = $auctionState.ignored[slug1] ||= {}
        if (ignored[id]) {
            delete ignored[id]
        }
        else {
            ignored[id] = true
        }
    }

    let debouncedResize: () => void
    let wrapperDiv: HTMLElement
    $: {
        if (wrapperDiv) {
            debouncedResize = getColumnResizer(auctionsContainer, wrapperDiv, 'table')
            debouncedResize()
        }
    }
    
    afterUpdate(() => debouncedResize?.())
</script>

<style lang="scss">
    .wrapper {
        column-count: 1;
        gap: 20px;
    }
    table {
        --padding: 2;

        display: inline-block;
        margin-bottom: 0.5rem;
    }
    th {
        background-color: $highlight-background;
        font-weight: normal;
    }
    .item {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        padding: 0.2rem $width-padding;
        text-align: left;
    }
    .ignore {
        font-weight: normal;
        padding-right: 0.6rem;
        text-align: right;
        white-space: nowrap;

        button {
            cursor: pointer;

            &:hover {
                color: $link-color;
            }
        }
    }
    .realm {
        @include cell-width(11.0rem, $paddingLeft: 0px);
    }
    .level {
        @include cell-width(1.8rem);

        text-align: right;
        white-space: nowrap;
    }
    .price {
        @include cell-width(4.5rem);

        text-align: right;
        white-space: nowrap;

        &.no-bid {
            color: #7f7f7f;
        }
    }
    .time-left {
        @include cell-width(4.2rem);

        text-align: right;
        word-spacing: -0.2ch;
    }
    .ignored {
        opacity: 0.7;

        th.item {
            width: 30rem;
        }

        + .ignored {
            margin-top: -0.7rem;
        }

        th {
            &:first-child {
                border-bottom-left-radius: $border-radius;
            }
            &:last-child {
                border-bottom-right-radius: $border-radius;
            }
        }
    }
</style>

<svelte:window on:resize={debouncedResize} />

{#await userAuctionMissingStore.search($auctionState, searchType)}
    <div class="wrapper">L O A D I N G . . .</div>
{:then [things, updated]}
    <Paginate
        items={(things || []).filter((thing) => $auctionState.hideIgnored
            ? $auctionState.ignored[slug1]?.[parseInt(thing.id)] !== true
            : true)}
        perPage={$auctionState.allRealms && !$auctionState.limitToBestRealms ? 6 : 18}
        {page}
        let:paginated
    >
        <div class="wrapper" bind:this={wrapperDiv}>
            {#each paginated as item}
                {@const auctions = $auctionState.limitToBestRealms ? item.auctions.slice(0, 5) : item.auctions}
                {@const ignored = $auctionState.ignored[slug1]?.[item.id] === true}
                <table
                    class="table table-striped"
                    class:ignored
                >
                    <thead>
                        <tr>
                            <th class="item" colspan="{slug1 === 'missing-pets' ? 4 : 3}">
                                <WowheadLink
                                    type={thingType}
                                    id={parseInt(item.id)}
                                >
                                    <WowthingImage
                                        name="{thingType}/{item.id}"
                                        size={20}
                                        border={1}
                                    />
                                    {item.name}
                                </WowheadLink>
                            </th>
                            <th class="ignore">
                                <button
                                    on:click|preventDefault={() => ignoreClick(item.id)}
                                >
                                    {ignored ? 'Unignore' : 'Ignore'}
                                </button>
                            </th>
                        </tr>
                    </thead>

                    {#if !ignored}
                        <tbody>
                            {#each auctions as auction}
                                {@const connectedRealm = $staticStore.connectedRealms[auction.connectedRealmId]}
                                {@const ageInMinutes = Math.floor(
                                    $timeStore.diff(
                                        DateTime.fromSeconds(updated[auction.connectedRealmId] || 1000)
                                    ).toMillis() / 1000 / 60
                                )}
                                <tr>
                                    <td
                                        class="realm text-overflow"
                                        use:componentTooltip={{
                                            component: RealmTooltip,
                                            props: {
                                                ageInMinutes,
                                                connectedRealm,
                                                price: auction.buyoutPrice,
                                            },
                                        }}
                                    >
                                        <code>[{Region[connectedRealm.region]}]</code>
                                        <span
                                            class:auction-age-1={ageInMinutes < 20}
                                            class:auction-age-2={ageInMinutes >= 20 && ageInMinutes < 40}
                                            class:auction-age-3={ageInMinutes >= 40 && ageInMinutes < 60}
                                            class:auction-age-4={ageInMinutes >= 60}
                                        >
                                            {connectedRealmName(auction.connectedRealmId)}
                                        </span>
                                    </td>
                                    {#if slug1 === 'missing-pets'}
                                        <td class="level quality{auction.petQuality}">
                                            {auction.petLevel}
                                        </td>
                                    {/if}
                                    <td
                                        class="price"
                                        class:no-bid={auction.bidPrice === 0}
                                    >
                                        {#if auction.bidPrice > 0}
                                            {Math.floor(auction.bidPrice / 10000).toLocaleString()} g
                                        {:else}
                                            &lt;no bid&gt;
                                        {/if}
                                    </td>
                                    <td
                                        class="price"
                                        class:no-bid={auction.bidPrice > 0 && auction.buyoutPrice === 0}
                                    >
                                        {#if auction.bidPrice > 0 && auction.buyoutPrice === 0}
                                            &lt;no b/o&gt;
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
                    {/if}
                </table>
            {:else}
                No results!
            {/each}
        </div>
    </Paginate>
{/await}
