<script lang="ts">
    import { timeStore } from '@/shared/stores/time';
    import { getCharacterRested } from '@/utils/get-character-rested';
    import type { CharacterProps } from '@/types/props';

    let { character }: CharacterProps = $props();

    let rested = $derived(getCharacterRested($timeStore, character)[0]);
</script>

<style lang="scss">
    td {
        --width: 3rem;

        border-left: 1px solid var(--border-color);
        text-align: right;

        &.center {
            text-align: center;
        }
    }
</style>

<td class:center={rested === '???'} data-tooltip="Rested XP">
    {rested || ''}
</td>
