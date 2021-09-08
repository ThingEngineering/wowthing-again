<script lang="ts">
    import { getContext } from 'svelte'

    import type {Character, CharacterGear} from '@/types'
    import getCharacterGear from '@/utils/get-character-gear'

    import RowItem from './TableRowItem.svelte'

    export let character: Character = undefined
    export let highlightMissingEnchants: boolean
    export let highlightMissingGems: boolean
    export let rowspan = 1

    let characterGear: CharacterGear[]
    $: {
        character = character || getContext('character')
        characterGear = getCharacterGear(character)
    }
</script>

<style lang="scss">
    .gear {
        padding: 2px;
        text-align: center;
        width: 46px;

        --icon-margin-top: 0;
    }
</style>

{#each characterGear as gear}
    <td class="gear" rowspan="{rowspan}">
        <RowItem {gear} bind:highlightMissingEnchants bind:highlightMissingGems />
    </td>
{/each}
