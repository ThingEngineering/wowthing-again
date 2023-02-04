<script lang="ts">
    import { gearState } from '@/stores/local-storage'
    import getCharacterGear from '@/utils/get-character-gear'
    import type { Character, CharacterGear } from '@/types'

    import Item from './ItemsItem.svelte'

    export let character: Character

    let characterGear: CharacterGear[]
    let useHighlighting = false
    $: {
        character = character
        characterGear = getCharacterGear($gearState, character)
        useHighlighting = $gearState.highlightAny
    }
</script>

<td class="spacer"></td>

{#each characterGear as gear}
    <Item
        {gear}
        {useHighlighting}
    />
{/each}
