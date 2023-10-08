<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer'

    import { itemModifierMap } from '@/data/item-modifier'
    import { staticStore } from '@/stores/static'
    import { leftPad } from '@/utils/formatting'
    import type { AuctionEntry } from '@/stores/auctions/types'

    import ParsedText from '@/components/common/ParsedText.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let auction: AuctionEntry = null
    export let baseUrl: string = null
    export let loading = false
    export let nextSelected = false
    export let selected = false

    let element: HTMLElement
    let intersected = false

    $: auctionUrl = !auction || selected ? `${baseUrl}` : `${baseUrl}/${auction.groupKey}`

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
</script>

<style lang="scss">
</style>

{#if auction}
    <IntersectionObserver once {element} bind:intersecting={intersected}>
        <tr
            class:next-selected={nextSelected}
            class:selected
            data-group-key={auction.groupKey}
            bind:this={element}
        >
            {#if intersected}
                <td class="icon">
                    <a href="{auctionUrl}">
                        <WowthingImage
                            name={getIconFromGroupKey(auction.groupKey)}
                            size={20}
                            border={1}
                        />
                    </a>
                </td>
                <td class="name text-overflow">
                    <a href="{auctionUrl}">
                        <ParsedText text={getNameFromGroupKey(auction.groupKey)} />
                    </a>
                </td>
                <td class="quantity">
                    {auction.totalQuantity.toLocaleString()}
                </td>
                <td class="price">
                    <code>{@html formatPrice(auction.lowestBuyoutPrice)}</code>
                </td>
            {:else}
                <td colspan="4" class="name">
                    <code></code>
                </td>
            {/if}
        </tr>
    </IntersectionObserver>
{:else}
    <tr>
        <td class="icon">
            <WowthingImage
                name={'unknown'}
                size={20}
                border={1}
            />
        </td>
        <td class="name">
            {#if loading}
                L O A D I N G . . .
            {:else}
                No results!
            {/if}
        </td>
        <td class="quantity"></td>
        <td class="price">
            <code></code>
        </td>
    </tr>
{/if}
