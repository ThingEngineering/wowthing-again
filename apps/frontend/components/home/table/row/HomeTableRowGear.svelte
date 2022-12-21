<script lang="ts">
    import { Constants } from '@/data/constants'
    import { currentTier } from '@/data/gear'
    import { itemStore } from '@/stores'
    import { tippyComponent } from '@/utils/tippy'
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/tier-set/TooltipTierSet.svelte'
    import { InventoryType } from '@/enums';

    export let character: Character

    let tierCount: number
    let tierPieces: [string, number][]
    $:
    {
        tierCount = 0

        if (character.equippedItems) {
            const tierPieceMap: Record<string, number> = {}
            for (const tierSlot in currentTier.slots) {
                tierPieceMap[tierSlot] = 0
            }

            for (const slot in character.equippedItems) {
                const item = character.equippedItems[slot]
                const tierSlot = $itemStore.data.currentTier[item.itemId]
                if (tierSlot) {
                    tierCount++
                    tierPieceMap[tierSlot] = item.itemLevel
                }
            }

            tierPieces = currentTier.slots
                .map((x) => [
                    InventoryType[x],
                    tierPieceMap[x],
                ])
        }
    }
</script>

<style lang="scss">
    td {
        @include cell-width($width-home-gear);

        --link-color: #{ $quality5-color };

        border-left: 1px solid $border-color;
        text-align: center;
    }
</style>

{#if character.level === Constants.characterMaxLevel}
    <td
        class:status-shrug={tierCount >= 2 && tierCount < 4}
        class:status-success={tierCount >= 4}
        use:tippyComponent={{
            component: Tooltip,
            props: {character, tierPieces},
        }}
    >
        {tierCount} pc
    </td>
{:else}
    <td></td>
{/if}
