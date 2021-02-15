<script lang="ts">
    import type {Character} from '../../types'

    export let character: Character
</script>

<style lang="scss">
    @import '../../../scss/variables.scss';

    td {
        padding-right: 0.5rem;
        text-align: right;
        width: $character-width-item-level;
    }
</style>

<td class="quality{character.calculatedItemLevelQuality}">{character.calculatedItemLevel}</td>
