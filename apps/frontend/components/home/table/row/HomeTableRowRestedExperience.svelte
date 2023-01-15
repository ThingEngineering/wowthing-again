<script lang="ts">
    import { timeStore } from '@/stores'
    import { getCharacterRested } from '@/utils/get-character-rested'
    import tippy from '@/utils/tippy'
    import type { Character } from '@/types'

    export let character: Character

    $: [rested,] = getCharacterRested($timeStore, character)[0]
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

<td
    class:center={rested === '???'}
    use:tippy={"Rested XP"}
>
    {rested}
</td>
 