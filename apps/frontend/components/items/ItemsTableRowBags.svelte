<script lang="ts">
    import { bankBagSlots, characterBagSlots } from '@/data/inventory-slot'
    import { staticStore } from '@/stores/static'
    import { gearState } from '@/stores/local-storage'
    import type { Character, CharacterGear } from '@/types'

    import Empty from './ItemsEmpty.svelte'
    import Item from './ItemsItem.svelte'

    export let character: Character

    let bagSets: [number, Partial<CharacterGear>][][]
    $: {
        bagSets = []
        for (const bagSlots of [characterBagSlots, bankBagSlots]) {
            const bagThings: [number, Partial<CharacterGear>][] = []
            
            for (const bagSlot of bagSlots) {
                const itemId = character.bags[bagSlot]
                const bag = $staticStore.bags[itemId]

                if (itemId && bag) {
                    bagThings.push([
                        bagSlot,
                        {
                            equipped: {
                                context: 0,
                                craftedQuality: 0,
                                itemId: itemId,
                                itemLevel: bag.slots,
                                quality: bag.quality,
                                bonusIds: [],
                                enchantmentIds: [],
                                gemIds: [],
                            },
                            highlight: $gearState.minimumBagSize > 0 && bag.slots < $gearState.minimumBagSize
                        }
                    ])
                }
                else {
                    bagThings.push([bagSlot, null])
                }
            }

            bagSets.push(bagThings)
        }
    }

    const getSlotText = function(slot: number): string {
        if (slot < 5) {
            return `Bag<br>${slot}`
        }
        else if (slot === 5) {
            return 'Rea<br>gent'
        }
        else {
            return `Bank<br>${slot - 5}`
        }
    }
</script>

{#each bagSets as bagSlots}
    <td class="spacer"></td>

    {#each bagSlots as [bagSlot, gear]}
        {#if gear}
            <Item
                {gear}
                useHighlighting={$gearState.highlightBagSize && $gearState.minimumBagSize > 0}
            />
        {:else}
            <Empty text={getSlotText(bagSlot)} />
        {/if}
    {/each}
{/each}
