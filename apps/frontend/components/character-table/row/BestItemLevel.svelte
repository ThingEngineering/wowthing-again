<script lang="ts">
    import getItemLevelQuality from '@/utils/get-item-level-quality';
    import type { Character } from '@/types'

    export let character: Character
</script>

<style lang="scss">
    td {
        @include cell-width($width-item-level);

        text-align: right;
    }
</style>

<td class="border-left quality{getItemLevelQuality(parseFloat(character.bestItemLevel))}">
    {character.bestItemLevel}
</td>
