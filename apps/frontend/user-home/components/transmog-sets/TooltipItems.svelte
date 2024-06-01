<script lang="ts">
    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte'
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte'
    import { itemStore } from '@/stores';
    import type { ItemDataItem } from '@/types/data/item';

    export let items: [boolean, number, number][]

    let byName: Record<string, [boolean, ItemDataItem]>
    let nameOrder: string[]
    $: {
        byName = {}
        nameOrder = []

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
        console.log(byName)
    }
</script>

{#each nameOrder.slice(0, 2) as itemName}
    {@const [itemHave, item] = byName[itemName]}
    <div class="item">
        <YesNoIcon state={itemHave} useStatusColors={true} />
        <ParsedText text={`{item:${item.id}}`} />
    </div>
{/each}
