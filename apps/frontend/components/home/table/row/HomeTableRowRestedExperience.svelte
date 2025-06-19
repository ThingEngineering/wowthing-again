<script lang="ts">
    import { timeStore } from '@/shared/stores/time';
    import { getCharacterRested } from '@/utils/get-character-rested';
    import { basicTooltip } from '@/shared/utils/tooltips';
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();

    let rested = $derived(getCharacterRested($timeStore, character)[0]);
</script>

<style lang="scss">
    td {
        @include cell-width($width-rested);

        border-left: 1px solid $border-color;
        text-align: right;

        &.center {
            text-align: center;
        }
    }
</style>

<td class:center={rested === '???'} use:basicTooltip={'Rested XP'}>
    {rested || ''}
</td>
