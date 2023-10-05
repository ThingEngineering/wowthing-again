<script lang="ts">
    import { itemModifierMap } from '@/data/item-modifier'
    import { staticStore } from '@/stores/static'
    import { auctionsBrowseState } from '@/stores/local-storage/auctions-browse'
    import { leftPad } from '@/utils/formatting'
    import type { AuctionEntry } from '@/stores/auctions/types'

    import ParsedText from '@/components/common/ParsedText.svelte'
    import Selected from './AppAuctionsBrowseSelected.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let auctions: AuctionEntry[]
    export let selectedKey: string

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
        if ($auctionsBrowseState.resultsSelected[selectedKey] === choreKey) {
            $auctionsBrowseState.resultsSelected[selectedKey] = null
        }
        else {
            $auctionsBrowseState.resultsSelected[selectedKey] = choreKey
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
        max-width: 25rem;
        width: 25rem;
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
    <div class="flex-wrapper">
        <div class="results">
            <table class="table table-striped">
                <thead>
                    <tr
                        class:next-selected={$auctionsBrowseState.resultsSelected[selectedKey] === auctions[0]?.groupKey}
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
                            class:next-selected={$auctionsBrowseState.resultsSelected[selectedKey] === auctions[auctionIndex + 1]?.groupKey}
                            class:selected={$auctionsBrowseState.resultsSelected[selectedKey] === auction.groupKey}
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

        {#if $auctionsBrowseState.resultsSelected[selectedKey]}
            <Selected selected={$auctionsBrowseState.resultsSelected[selectedKey]} />
        {/if}
    </div>
</div>
