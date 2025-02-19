<script lang="ts">
    import { itemSearchState, itemStore, userStore } from '@/stores'
    import { toNiceNumber } from '@/utils/formatting'
    import { basicTooltip } from '@/shared/utils/tooltips'
    import type { ItemSearchResponseCharacter, ItemSearchResponseItem } from '@/types/items'

    import Row from './ItemsSearchItemRow.svelte'
    import WowthingImage from '@/shared/components/images/sources/WowthingImage.svelte'

    export let response: ItemSearchResponseItem[]

    type Sigh = {
        characterItems: ItemSearchResponseCharacter[];
        itemCount: number;
    }
    const getCombinedItems = (item: ItemSearchResponseItem): Sigh => {
        const ret: Sigh = {
            characterItems: [],
            itemCount: 0,
        };
        
        ret.characterItems = [...(item.characters || [])];
        if ($itemSearchState.includeEquipped) {
            ret.characterItems.push(...(item.equipped || []));
        }

        ret.itemCount = ret.characterItems.reduce((a, b) => a + b.count, 0) +
            (item.guildBanks?.reduce((a, b) => a + b.count, 0) || 0) +
            (item.warbank?.reduce((a, b) => a + b.count, 0) || 0);

        return ret;
    }
</script>

{#each response as item}
    {@const { characterItems, itemCount } = getCombinedItems(item)}
    {#if itemCount > 0}
        <table class="table table-striped search-table">
            <thead>
                <tr class="item-row">
                    <th
                        class="item quality{$itemStore.items[item.itemId].quality} text-overflow"
                        colspan="{userStore.useAccountTags ? 4 : 3}"
                    >
                        <WowthingImage name="item/{item.itemId}" size={20} border={1} />
                        {item.itemName}
                    </th>
                    <th
                        class="count"
                        use:basicTooltip={itemCount.toLocaleString()}
                    >
                        {toNiceNumber(itemCount)}
                    </th>
                    <th class="item-level">ILvl</th>
                </tr>
            </thead>

            <tbody>
                {#each characterItems as characterItem}
                    <Row
                        itemId={item.itemId}
                        {characterItem}
                    />
                {/each}

                {#each (item.guildBanks || []) as guildBankItem}
                    <Row
                        itemId={item.itemId}
                        {guildBankItem}
                    />
                {/each}

                {#each (item.warbank || []) as warbankItem}
                    <Row
                        itemId={item.itemId}
                        {warbankItem}
                    />
                {/each}
            </tbody>
        </table>
    {/if}
{:else}
    <table class="table table-striped search-table">
        <tr>
            <td>No items found.</td>
        </tr>
    </table>
{/each}
