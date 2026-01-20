<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/item-level/Tooltip.svelte';

    let { character }: CharacterProps = $props();
</script>

<style lang="scss">
    td {
        --width: var(--width-item-level);

        text-align: right;
    }
</style>

<td
    class="border-left quality{character.calculatedItemLevelQuality}"
    use:componentTooltip={{
        component: Tooltip,
        props: {},
    }}
>
    {character.calculatedItemLevel}
</td>
