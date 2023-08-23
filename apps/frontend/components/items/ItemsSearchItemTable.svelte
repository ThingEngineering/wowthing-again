<script lang="ts">
    import { itemStore, userStore } from '@/stores'
    import { toNiceNumber } from '@/utils/formatting'
    import tippy from '@/utils/tippy'
    import type { ItemSearchResponseItem } from '@/types/items'

    import Row from './ItemsSearchItemRow.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let response: ItemSearchResponseItem[]
</script>

{#each response as item}
    {@const itemCount = item.characters.reduce((a, b) => a + b.count, 0) + 
        item.guildBanks.reduce((a, b) => a + b.count, 0)}
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
                    use:tippy={itemCount.toLocaleString()}
                >
                    {toNiceNumber(itemCount)}
                </th>
                <th class="item-level">ILvl</th>
            </tr>
        </thead>

        <tbody>
            {#each (item.characters || []) as characterItem}
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
        </tbody>
    </table>
{:else}
    <table class="table table-striped search-table">
        <tr>
            <td>No items found.</td>
        </tr>
    </table>
{/each}
