<script lang="ts">
    import { auctionStore } from '@/stores/auction'
    import { auctionsBrowseDataStore } from '@/stores/auctions/browse'
    import { auctionsBrowseState } from '@/stores/local-storage/auctions-browse'
    import { leftPad } from '@/utils/formatting'
    import type { AuctionCategory } from '@/types/data/auction'

    import ParsedText from '@/components/common/ParsedText.svelte'
    import Selected from './AppAuctionsBrowseSelected.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'
    import { itemStore, staticStore } from '@/stores';
    import { itemModifierMap } from '@/data/item-modifier';

    export let category: AuctionCategory

    function formatPrice(price: number): string {
        price = price / 100
        const silver = leftPad(price % 100, 2, '&nbsp;')
        const gold = Math.floor(price / 100)

        return gold ? `${gold.toLocaleString()}g ${silver}s` : `${silver}s`
    }

    function getIconFromGroupKey(groupKey: string): string {
        if (groupKey.startsWith('item:')) {
            return `item/${groupKey.split(':')[1]}`
        }
        else if (groupKey.startsWith('pet:')) {
            const pet = $staticStore.pets[parseInt(groupKey.split(':')[1])]
            return `npc/${pet.creatureId}`
        }
        else if (groupKey.startsWith('source:')) {
            const source = groupKey.split(':')[1].replace('_0', '')
            return `item/${source}`
        }
        else {
            return 'unknown'
        }
    }

    function getNameFromGroupKey(groupKey: string): string {
        if (groupKey.startsWith('item:')) {
            return `{${groupKey}}`
        }
        else if (groupKey.startsWith('pet:')) {
            const pet = $staticStore.pets[parseInt(groupKey.split(':')[1])]
            return pet.name
        }
        else if (groupKey.startsWith('source:')) {
            const sourceParts = groupKey.split(':')[1].split('_')
            let text = `{item:${sourceParts[0]}}`
            if (sourceParts[1] !== '0') {
                const modifier = itemModifierMap[parseInt(sourceParts[1])]
                if (modifier) {
                    text = `[${modifier[1]}] ${text}`
                }
            }
            return text
        }
        else {
            return groupKey
        }
    }

    function toggleSelected(choreKey: string) {
        if ($auctionsBrowseState.browseSelected[category.id] === choreKey) {
            $auctionsBrowseState.browseSelected[category.id] = null
        }
        else {
            $auctionsBrowseState.browseSelected[category.id] = choreKey
        }
    }
</script>

<style lang="scss">
    .flex-wrapper {
        align-items: start;
        justify-content: flex-start;
        gap: 2rem;
    }
    .results {
        max-height: 80vh;
        overflow-y: scroll;
        scrollbar-gutter: stable;
    }
    td {
        padding: 0.15rem 0.4rem;
    }
    .selectable {
        cursor: pointer;
    }
    .next-selected {
        td, th {
            border-bottom-width: 0;
        }
    }
    .selected {
        td {
            background: $highlight-background;
            border-color: #fff;
            border-top: 1px solid #fff;
        }
    }
    .icon {
        --image-border-width: 1px;
        --image-margin-top: -4px;

        padding-right: 0;
        width: 1.7rem;
    }
    .name {
        max-width: 20rem;
        width: 20rem;
    }
    .quantity {
        text-align: right;
        width: 5.5rem;
    }
    .price {
        text-align: right;
        width: 9.5rem;
    }
    code {
        background: transparent;
        color: $body-text;
    }
</style>

<div>
    {#await auctionsBrowseDataStore.search($auctionStore, category.id)}
        L O A D I N G . . .
    {:then auctions}
        <div class="flex-wrapper">
            <div class="results">
                <table class="table table-striped">
                    <thead>
                        <tr
                            class:next-selected={$auctionsBrowseState.browseSelected[category.id] === auctions[0]?.groupKey}
                        >
                            <th colspan="2">Thing</th>
                            <th>Listed</th>
                            <th>Cheapest</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each auctions as auction, auctionIndex}
                            <tr
                                class="selectable"
                                class:next-selected={$auctionsBrowseState.browseSelected[category.id] === auctions[auctionIndex + 1]?.groupKey}
                                class:selected={$auctionsBrowseState.browseSelected[category.id] === auction.groupKey}
                                on:click={() => toggleSelected(auction.groupKey)}
                            >
                                <td class="icon">
                                    <WowthingImage
                                        name={getIconFromGroupKey(auction.groupKey)}
                                        size={20}
                                        border={1}
                                    />
                                </td>
                                <td class="name text-overflow">
                                    <ParsedText text={getNameFromGroupKey(auction.groupKey)} />
                                </td>
                                <td class="quantity">
                                    {auction.totalQuantity.toLocaleString()}
                                </td>
                                <td class="price">
                                    <code>{@html formatPrice(auction.lowestBuyoutPrice)}</code>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            {#if $auctionsBrowseState.browseSelected[category.id]}
                <Selected selected={$auctionsBrowseState.browseSelected[category.id]} />
            {/if}
        </div>
    {/await}
</div>
