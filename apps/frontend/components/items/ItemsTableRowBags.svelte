<script lang="ts">
    import { bankBagSlots, characterBagSlots } from '@/data/inventory-slot';
    import { browserState } from '@/shared/state/browser.svelte';
    import { wowthingData } from '@/shared/stores/data';
    import { CharacterEquippedItem, type CharacterGear } from '@/types';
    import type { CharacterProps } from '@/types/props';

    import Empty from './ItemsEmpty.svelte';
    import Item from './ItemsItem.svelte';

    let { character }: CharacterProps = $props();

    let bags = $derived.by(() => {
        const ret: [number, Partial<CharacterGear>][] = [];
        for (const bagSlot of characterBagSlots) {
            const itemId = character.bags[bagSlot];
            const bag = wowthingData.static.bagById.get(itemId);

            if (itemId && bag) {
                ret.push([
                    bagSlot,
                    {
                        equipped: new CharacterEquippedItem(
                            0,
                            0,
                            itemId,
                            bag.slots,
                            bag.quality,
                            [],
                            [],
                            []
                        ),
                        highlight:
                            browserState.current.items.minimumBagSize > 0 &&
                            bag.slots < browserState.current.items.minimumBagSize,
                    },
                ]);
            } else {
                ret.push([bagSlot, null]);
            }
        }
        return ret;
    });

    const getSlotText = function (slot: number): string {
        if (slot < 5) {
            return `Bag<br>${slot}`;
        } else if (slot === 5) {
            return 'Rea<br>gent';
        } else {
            return `Bank<br>${slot - 5}`;
        }
    };
</script>

<td class="spacer"></td>
{#each bags as [bagSlot, gear] (bagSlot)}
    {#if gear}
        <Item
            {gear}
            useHighlighting={browserState.current.items.highlightBagSize &&
                browserState.current.items.minimumBagSize > 0}
        />
    {:else}
        <Empty text={getSlotText(bagSlot)} />
    {/if}
{/each}

<td class="spacer"></td>
{#each bankBagSlots as bankBagSlot (bankBagSlot)}
    {#if character.bankTabs > bankBagSlot - 6}
        <Empty text={getSlotText(bankBagSlot)} --item-empty-border="var(--color-success)" />
    {:else}
        <Empty text={getSlotText(bankBagSlot)} />
    {/if}
{/each}
