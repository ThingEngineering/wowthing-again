<script lang="ts">
    import { componentTooltip } from '@/shared/utils/tooltips';
    import type { CharacterProps } from '@/types/props';

    import Tooltip from '@/components/tooltips/CharacterMovementSpeedTooltip.svelte';

    let { character }: CharacterProps = $props();

    let speed = $derived(character.movementSpeed);
</script>

<style lang="scss">
    td {
        --width: 2rem;

        word-spacing: -0.2ch;
    }
</style>

<td
    class="r b-l"
    use:componentTooltip={{
        component: Tooltip,
        propsFunc: () => ({ character, movementSpeed: speed }),
    }}
>
    {#if speed.total > 0}
        +{speed.total.toFixed(0)}%
    {/if}
</td>
