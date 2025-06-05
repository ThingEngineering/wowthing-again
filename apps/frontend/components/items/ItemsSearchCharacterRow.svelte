<script lang="ts">
    import { ItemLocation } from '@/enums/item-location';
    import { settingsState } from '@/shared/state/settings.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import { itemSearchState } from '@/stores';
    import { getItemUrlSearch } from '@/utils/get-item-url';
    import { toNiceNumber } from '@/utils/formatting';
    import type {
        ItemSearchResponseCharacter,
        ItemSearchResponseCommon,
        ItemSearchResponseGuildBank,
    } from '@/types/items';

    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte';

    export let characterItem: ItemSearchResponseCharacter = null;
    export let guildBankItem: ItemSearchResponseGuildBank = null;
    export let itemId: number;

    let item: ItemSearchResponseCommon;
    let show: boolean;
    $: {
        item = characterItem || guildBankItem;
        show = $itemSearchState.minimumQuality <= item.quality;
    }
</script>

{#if show}
    <tr class:highlight={!!guildBankItem}>
        <td class="item text-overflow" colspan={settingsState.useAccountTags ? 2 : 1}>
            <a
                class="quality{item.quality || wowthingData.items.items[itemId].quality || 0}"
                href={getItemUrlSearch(itemId, item)}
            >
                <WowthingImage name="item/{itemId}" size={20} border={1} />
                {wowthingData.items.items[itemId]?.name || `Item #${itemId}`}
            </a>
        </td>

        <td
            class="location text-overflow"
            use:basicTooltip={characterItem
                ? ItemLocation[characterItem.location]
                : `Tab ${guildBankItem.tab}`}
        >
            {#if characterItem}
                {ItemLocation[characterItem.location]}
            {:else}
                Tab {guildBankItem.tab}
            {/if}
        </td>
        <td class="count">
            {toNiceNumber(characterItem?.count || guildBankItem.count)}
        </td>
        <td class="item-level">
            {characterItem?.itemLevel ||
                guildBankItem?.itemLevel ||
                wowthingData.items.items[itemId].itemLevel ||
                0}
        </td>
    </tr>
{/if}
