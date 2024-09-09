<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { Character } from '@/types'

    import Tooltip from '@/components/tooltips/item-level/Tooltip.svelte'

    export let character: Character
</script>

<style lang="scss">
    td {
        @include cell-width($width-item-level);

        text-align: right;
    }
</style>

<td
    class="border-left quality{character.calculatedItemLevelQuality}"
    use:componentTooltip={{
        component: Tooltip,
        props: {}
    }}
>
    {character.calculatedItemLevel}
</td>
