<script lang="ts">
    import type { Character } from '@/types'

    export let character: Character
</script>

<style lang="scss">
    td {
        @include cell-width($width-item-level);

        text-align: right;
    }
</style>

<td class="border-left quality{character.calculatedItemLevelQuality}">
    {character.calculatedItemLevel}
</td>
