<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips';
    import getItemLevelQuality from '@/utils/get-item-level-quality';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/character-best-item-level/Tooltip.svelte';

    let { character }: CharacterProps = $props();

    let bestItemLevels = $derived.by(() => character.bestItemLevels);
    let itemLevel = $derived(bestItemLevels?.[character.activeSpecId]?.[0]);
</script>

<style lang="scss">
    td {
        --width: var(--width-item-level);

        text-align: right;
    }
</style>

<td
    class="border-left quality{itemLevel
        ? getItemLevelQuality(parseFloat(itemLevel))
        : character.calculatedItemLevelQuality}"
    use:componentTooltip={{
        component: Tooltip,
        props: {
            bestItemLevels,
            character,
        },
    }}
>
    {itemLevel || character.calculatedItemLevel}
</td>
