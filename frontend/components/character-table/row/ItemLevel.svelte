<script lang="ts">
    import { getContext } from 'svelte'

    import type { Character } from '@/types'

    const character: Character = getContext('character')
</script>

<style lang="scss">
    td {
        @include cell-width($character-width-item-level);

        text-align: right;
    }
</style>

<td class="quality{character.calculatedItemLevelQuality}">{character.calculatedItemLevel}</td>
