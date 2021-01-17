<script lang="ts">
    import type {Character} from '../../types'

    export let character: Character
</script>

<style lang="scss">
    td {
        text-align: right;
        width: 3rem;
    }
</style>

<td class="quality{character.calculatedItemLevelQuality}">{character.calculatedItemLevel}</td>
