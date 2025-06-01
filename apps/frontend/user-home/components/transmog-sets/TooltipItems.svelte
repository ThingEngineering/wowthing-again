<script lang="ts">
    import { itemModifierMap } from '@/data/item-modifier';
    import { itemStore } from '@/stores';
    import { getClassesFromMask } from '@/utils/get-classes-from-mask';
    import type { TransmogSlot } from '@/stores/lazy/transmog';
    import type { ItemDataItem } from '@/types/data/item';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    export let dedupe: boolean = true;
    // isCollected, itemId, modifier
    export let items: TransmogSlot[];

    let itemData: [boolean, ItemDataItem, number?][];
    $: {
        itemData = [];

        if (dedupe) {
            const byName: Record<string, [boolean, ItemDataItem]> = {};
            const nameOrder: string[] = [];

            for (const [, haveSource, itemId] of items) {
                // const have = completionist ? haveSource : haveAppearance;
                const have = haveSource;
                const item = $itemStore.items[itemId];
                if (!byName[item.name]) {
                    byName[item.name] = [have, item];
                    nameOrder.push(item.name);
                }
                byName[item.name][0] ||= have;
            }

            nameOrder.sort((a, b) => {
                const aHave = byName[a][0];
                const bHave = byName[b][0];
                if (aHave === true && bHave === false) {
                    return -1;
                } else if (aHave === false && bHave === true) {
                    return 1;
                }
                return 0;
            });

            itemData = nameOrder.map((name) => byName[name]);
        } else {
            itemData = items.map(([, haveSource, itemId, modifier]) => [
                haveSource,
                $itemStore.items[itemId],
                modifier,
            ]);
        }

        itemData.sort(([aHave], [bHave]) => {
            if (aHave === true && bHave === false) {
                return -1;
            } else if (aHave === false && bHave === true) {
                return 1;
            }
            return 0;
        });

        if (dedupe) {
            itemData = itemData.slice(0, 2);
        }
    }

    function getItemText(item: ItemDataItem, modifier: number): string {
        const parts: string[] = [];

        if (modifier) {
            parts.push(`[${itemModifierMap[modifier][1]}]`);
        }

        if (item.allianceOnly) {
            parts.push(':alliance:');
        } else if (item.hordeOnly) {
            parts.push(':horde:');
        }

        if (item.classMask > 0) {
            const classes = getClassesFromMask(item.classMask);
            if (classes.length === 1) {
                parts.push(`:class-${classes[0]}:`);
            }
        }

        parts.push(`{item:${item.id}}`);

        return parts.join(' ');
    }
</script>

{#each itemData as [itemHave, item, modifier] (`${item.id}-${modifier}`)}
    <div class="item">
        <YesNoIcon state={itemHave} useStatusColors={true} />
        <ParsedText text={getItemText(item, modifier)} />
    </div>
{:else}
    No items to show!
{/each}
