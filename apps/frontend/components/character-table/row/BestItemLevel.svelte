<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips';
    import getItemLevelQuality from '@/utils/get-item-level-quality';
    import type { Character } from '@/types';

    import Tooltip from '@/components/tooltips/character-best-item-level/Tooltip.svelte'
    import { staticStore } from '@/shared/stores/static';
    import { itemStore } from '@/stores';

    export let character: Character;

    $: bestItemLevels = character.getBestItemLevels($itemStore, $staticStore);
    $: itemLevel = bestItemLevels[character.activeSpecId];
</script>

<style lang="scss">
    td {
        @include cell-width($width-item-level);

        text-align: right;
    }
</style>

<td
    class="border-left quality{itemLevel ? getItemLevelQuality(parseFloat(itemLevel)) : character.calculatedItemLevelQuality}"
    use:componentTooltip={{
        component: Tooltip,
        props: {
            bestItemLevels,
            character,
        }
    }}
>
    {itemLevel || character.calculatedItemLevel}
</td>
