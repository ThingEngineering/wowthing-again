<script lang="ts">
    import { basicTooltip } from '@/shared/utils/tooltips';
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();

    let slots = $derived(character.bagSlotsFree);
</script>

<style lang="scss">
    td {
        --width: 2rem;
    }
</style>

<td
    class="r b-l sized"
    class:status-success={slots >= 30}
    class:status-shrug={slots >= 10 && slots < 30}
    class:status-warn={slots > 0 && slots < 10}
    class:status-fail={slots === 0}
    use:basicTooltip={`${slots} / ${character.bagSlotsTotal} empty bag slots`}
>
    {slots}
</td>
