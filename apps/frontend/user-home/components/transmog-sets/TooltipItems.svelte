<script lang="ts">
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte'
    import { itemStore } from '@/stores';
    import type { ItemDataItem } from '@/types/data/item';
    import { itemModifierMap } from '@/data/item-modifier';

    export let dedupe: boolean = true
    // isCollected, itemId, modifier
    export let items: [boolean, number, number][]

    let itemData: [boolean, ItemDataItem, number?][]
    $: {
        itemData = []

        if (dedupe) {
            const byName: Record<string, [boolean, ItemDataItem]> = {}
            const nameOrder: string[] = []

            for (const [itemHave, itemId] of items) {
                const item = $itemStore.items[itemId]
                if (!byName[item.name]) {
                    byName[item.name] = [itemHave, item]
                    nameOrder.push(item.name)
                }
                byName[item.name][0] ||= itemHave
            }

            nameOrder.sort((a, b) => {
                const aHave = byName[a][0]
                const bHave = byName[b][0]
                if (aHave === true && bHave === false) {
                    return -1;
                } else if (aHave === false && bHave === true) {
                    return 1;
                }
                return 0;
            })

            itemData = nameOrder.map((name) => byName[name])
        } else {
            itemData = items.map(([itemHave, itemId, modifier]) => [itemHave, $itemStore.items[itemId], modifier])
        }
    }
</script>

{#each itemData as [itemHave, item, modifier]}
    <div class="item">
        <YesNoIcon state={itemHave} useStatusColors={true} />
        <ParsedText text={`${modifier !== undefined ? `[${itemModifierMap[modifier][1]}] ` : ''}{item:${item.id}}`} />
    </div>
{:else}
    No items to show!
{/each}
