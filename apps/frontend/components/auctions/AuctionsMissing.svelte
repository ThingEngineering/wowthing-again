<script lang="ts">
    import { DateTime } from 'luxon';

    import { timeLeft } from '@/data/auctions';
    import { euLocales } from '@/data/region';
    import { Region } from '@/enums/region';
    import { wowthingData } from '@/shared/stores/data';
    import { timeStore } from '@/shared/stores/time';
    import { componentTooltip } from '@/shared/utils/tooltips';
    import { userAuctionMissingStore } from '@/stores';
    import { auctionState } from '@/stores/local-storage/auctions';
    import connectedRealmName from '@/utils/connected-realm-name';
    import { getColumnResizer } from '@/utils/get-column-resizer';

    import IconifyIcon from '@/shared/components/images/IconifyIcon.svelte';
    import Paginate from '@/shared/components/paginate/Paginate.svelte';
    import RealmTooltip from './RealmTooltip.svelte';
    import WowheadLink from '@/shared/components/links/WowheadLink.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    type Props = {
        auctionsContainer: HTMLElement;
        page: number;
        slug1: string;
    };

    let { auctionsContainer, page, slug1 }: Props = $props();

    let searchType = $derived(slug1.replace('missing-', ''));
    let thingType = $derived.by(() => {
        if (slug1 === 'missing-mounts') {
            return 'spell';
        } else if (slug1 === 'missing-pets') {
            return 'npc';
        } else if (slug1 === 'missing-toys') {
            return 'item';
        }
    });

    let colspan = $derived(
        (slug1 === 'missing-pets' ? 3 : 2) + ($auctionState.includeBids ? 1 : 0)
    );

    const ignoreClick = function (id: string): void {
        const ignored = ($auctionState.ignored[slug1] ||= {});
        if (ignored[id]) {
            delete ignored[id];
        } else {
            ignored[id] = true;
        }
    };

    let wrapperDiv = $state<HTMLElement>(null);
    let debouncedResize = $derived(
        wrapperDiv ? getColumnResizer(auctionsContainer, wrapperDiv, 'table') : null
    );

    $effect(() => debouncedResize?.());
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
        background-color: var(--color-highlight-background);
        font-weight: normal;
    }
    .item {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        padding: 0.2rem inherit;
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
                color: var(--color-link);
            }
        }
    }
    .realm {
        --padding-left: 0;
        --width: 11rem;
    }
    .level {
        --width: 1.8rem;

        text-align: right;
        white-space: nowrap;
    }
    .price {
        --width: 4.5rem;

        text-align: right;
        white-space: nowrap;

        &.no-bid {
            color: #7f7f7f;
        }
    }
    .time-left {
        --width: 4.2rem;

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
                border-bottom-left-radius: var(--border-radius);
            }
            &:last-child {
                border-bottom-right-radius: var(--border-radius);
            }
        }
    }
</style>

<svelte:window on:resize={debouncedResize} />

{#await userAuctionMissingStore.search($auctionState, searchType)}
    <div class="wrapper">L O A D I N G . . .</div>
{:then [things, updated]}
    <Paginate
        items={(things || []).filter((thing) =>
            $auctionState.hideIgnored
                ? $auctionState.ignored[slug1]?.[parseInt(thing.id)] !== true
                : true
        )}
        perPage={$auctionState.allRealms && !$auctionState.limitToBestRealms ? 12 : 24}
        {page}
        let:paginated
    >
        <div class="wrapper" bind:this={wrapperDiv}>
            {#each paginated as item (item.id)}
                {@const auctions = $auctionState.limitToBestRealms
                    ? item.auctions.slice(0, 5)
                    : item.auctions}
                {@const ignored = $auctionState.ignored[slug1]?.[item.id] === true}
                <table class="table table-striped" class:ignored>
                    <thead>
                        <tr>
                            <th class="item" {colspan}>
                                <WowheadLink type={thingType} id={parseInt(item.id)}>
                                    <WowthingImage
                                        name="{thingType}/{item.id}"
                                        size={20}
                                        border={1}
                                    />
                                    {item.name}
                                </WowheadLink>
                            </th>
                            <th class="ignore">
                                <button onclick={() => ignoreClick(item.id)}>
                                    {ignored ? 'Unignore' : 'Ignore'}
                                </button>
                            </th>
                        </tr>
                    </thead>

                    {#if !ignored}
                        <tbody>
                            {#each auctions as auction (auction)}
                                {@const connectedRealm = wowthingData.static.connectedRealmById.get(
                                    auction.connectedRealmId
                                )}
                                {@const ageInMinutes = Math.floor(
                                    $timeStore
                                        .diff(
                                            DateTime.fromSeconds(
                                                updated[auction.connectedRealmId] || 1000
                                            )
                                        )
                                        .toMillis() /
                                        1000 /
                                        60
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
                                        {#if connectedRealm.region === Region.EU && euLocales[connectedRealm.locale]}
                                            {@const { icon: countryIcon, name: countryName } =
                                                euLocales[connectedRealm.locale]}
                                            <IconifyIcon
                                                dropShadow={true}
                                                icon={countryIcon}
                                                tooltip={`EU: ${countryName}`}
                                            />
                                        {:else}
                                            <code>[{Region[connectedRealm.region]}]</code>
                                        {/if}

                                        <span
                                            class:auction-age-1={ageInMinutes < 20}
                                            class:auction-age-2={ageInMinutes >= 20 &&
                                                ageInMinutes < 40}
                                            class:auction-age-3={ageInMinutes >= 40 &&
                                                ageInMinutes < 60}
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
                                    {#if $auctionState.includeBids}
                                        <td class="price" class:no-bid={auction.bidPrice === 0}>
                                            {#if auction.bidPrice > 0}
                                                {Math.floor(
                                                    auction.bidPrice / 10000
                                                ).toLocaleString()} g
                                            {:else}
                                                &lt;no bid&gt;
                                            {/if}
                                        </td>
                                    {/if}
                                    <td
                                        class="price"
                                        class:no-bid={auction.bidPrice > 0 &&
                                            auction.buyoutPrice === 0}
                                    >
                                        {#if auction.bidPrice > 0 && auction.buyoutPrice === 0}
                                            &lt;no b/o&gt;
                                        {:else}
                                            {Math.floor(
                                                auction.buyoutPrice / 10000
                                            ).toLocaleString()} g
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
