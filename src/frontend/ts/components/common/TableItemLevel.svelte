<script lang="ts">
    import type {Character} from '../../types'

    export let character: Character
</script>

<style lang="scss">
    td {
        padding-right: 0.5rem;
        text-align: right;
        width: 3rem;
    }
</style>

<td class="quality{character.calculatedItemLevelQuality}">{character.calculatedItemLevel}</td>
