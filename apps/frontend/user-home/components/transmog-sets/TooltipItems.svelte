<script lang="ts">
    import { itemModifierMap } from '@/data/item-modifier';
    import { wowthingData } from '@/shared/stores/data';
    import { getClassesFromMask } from '@/utils/get-classes-from-mask';
    import type { TransmogSlot } from '@/user-home/state/lazy/transmog.svelte';
    import type { ItemDataItem } from '@/types/data/item';

    import ParsedText from '@/shared/components/parsed-text/ParsedText.svelte';
    import YesNoIcon from '@/shared/components/icons/YesNoIcon.svelte';

    type Props = {
        dedupe?: boolean;
        // isCollected, itemId, modifier
        items: TransmogSlot[];
    };
    let { dedupe = true, items }: Props = $props();

    let itemData = $derived.by(() => {
        let ret: [boolean, ItemDataItem, number?][];

        if (dedupe) {
            const byName: Record<string, [boolean, ItemDataItem]> = {};
            const nameOrder: string[] = [];

            for (const [, haveSource, itemId] of items) {
                // const have = completionist ? haveSource : haveAppearance;
                const have = haveSource;
                const item = wowthingData.items.items[itemId];
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

            ret = nameOrder.map((name) => byName[name]);
        } else {
            ret = items.map(([, haveSource, itemId, modifier]) => [
                haveSource,
                wowthingData.items.items[itemId],
                modifier,
            ]);
        }

        ret.sort(([aHave], [bHave]) => {
            if (aHave === true && bHave === false) {
                return -1;
            } else if (aHave === false && bHave === true) {
                return 1;
            }
            return 0;
        });

        if (dedupe) {
            ret = ret.slice(0, 2);
        }

        return ret;
    });

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
