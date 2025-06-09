<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';

    import { itemModifierMap } from '@/data/item-modifier';
    import { Faction } from '@/enums/faction';
    import { wowthingData } from '@/shared/stores/data';
    import { leftPad } from '@/utils/formatting';
    import type { AuctionEntry } from '@/auctions/types/auction-entry';

    import FactionIcon from '@/shared/components/images/FactionIcon.svelte';
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let auction: AuctionEntry = null;
    export let baseUrl: string = null;
    export let loading = false;
    export let nextSelected = false;
    export let selected = false;

    let element: HTMLElement;
    let intersected = false;

    $: auctionUrl = !auction || selected ? `${baseUrl}` : `${baseUrl}/${auction.groupKey}`;

    function formatPrice(price: number): string {
        price = price / 100;
        const silver = leftPad(price % 100, 2, '&nbsp;');
        const gold = Math.floor(price / 100);

        return gold ? `${gold.toLocaleString()}g ${silver}s` : `${silver}s`;
    }

    class AuctionInfo {
        public faction: Faction = Faction.Neutral;
        public icon: string;
        public itemLevel: number;
        public name: string;
    }
    function getInfoFromGroupKey(groupKey: string): AuctionInfo {
        const ret = new AuctionInfo();

        if (groupKey.startsWith('item:')) {
            const itemId = parseInt(groupKey.split(':')[1]);
            const item = wowthingData.items.items[itemId];

            if (item.allianceOnly) {
                ret.faction = Faction.Alliance;
            } else if (item.hordeOnly) {
                ret.faction = Faction.Horde;
            }

            ret.icon = `item/${itemId}`;
            ret.itemLevel = item?.itemLevel || 1;
            ret.name = `{${groupKey}}`;
        } else if (groupKey.startsWith('pet:')) {
            const pet = wowthingData.static.petById.get(parseInt(groupKey.split(':')[1]));
            ret.icon = `npc/${pet.creatureId}`;
            ret.itemLevel = 1;
            ret.name = pet.name;
        } else if (groupKey.startsWith('source:')) {
            const sourceParts = groupKey.split(':')[1].split('_');
            const itemId = parseInt(sourceParts[0]);
            const item = wowthingData.items.items[itemId];

            if (item.allianceOnly) {
                ret.faction = Faction.Alliance;
            } else if (item.hordeOnly) {
                ret.faction = Faction.Horde;
            }

            ret.icon = `item/${sourceParts.slice(0, sourceParts[1] === '0' ? 1 : 2).join('_')}`;
            ret.itemLevel = item?.itemLevel || 1;
            ret.name = `{item:${itemId}}`;
            if (sourceParts[1] !== '0') {
                const modifier = itemModifierMap[parseInt(sourceParts[1])];
                if (modifier) {
                    ret.name = `[${modifier[1]}] ${ret.name}`;
                }
            }
        } else {
            ret.icon = 'unknown';
            ret.name = groupKey;
        }

        return ret;
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
                {@const { faction, icon, itemLevel, name } = getInfoFromGroupKey(auction.groupKey)}
                <td class="icon">
                    <a href={auctionUrl}>
                        <WowthingImage name={icon} size={20} border={1} />
                    </a>
                </td>
                <td class="name text-overflow">
                    <a href={auctionUrl}>
                        {#if faction !== Faction.Neutral}
                            <FactionIcon {faction} />
                        {/if}

                        <ParsedText text={name} />
                    </a>
                </td>
                <td class="item-level">
                    {itemLevel}
                </td>
                <td class="quantity">
                    {auction.totalQuantity.toLocaleString()}
                </td>
                <td class="price">
                    <code>{@html formatPrice(auction.lowestBuyoutPrice)}</code>
                </td>
            {:else}
                <td colspan="5" class="name">
                    <code></code>
                </td>
            {/if}
        </tr>
    </IntersectionObserver>
{:else}
    <tr>
        <td class="icon">
            <WowthingImage name="unknown" size={20} border={1} />
        </td>
        <td class="name">
            {#if loading}
                L O A D I N G . . .
            {:else}
                No results!
            {/if}
        </td>
        <td class="item-level"></td>
        <td class="quantity"></td>
        <td class="price">
            <code></code>
        </td>
    </tr>
{/if}
