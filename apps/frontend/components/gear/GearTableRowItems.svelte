<script lang="ts">
    import { iconStrings } from '@/data/icons'
    import { Constants } from '@/data/constants'
    import { gearState } from '@/stores/local-storage'
    import getCharacterGear from '@/utils/get-character-gear'
    import { getItemUrl } from '@/utils/get-item-url'
    import type { Character, CharacterGear } from '@/types'

    import Item from './GearItem.svelte'
    import IconifyIcon from '../images/IconifyIcon.svelte'
    import WowthingImage from '@/components/images/sources/WowthingImage.svelte'

    export let character: Character

    let characterGear: CharacterGear[]
    let useHighlighting = false
    $: {
        character = character
        characterGear = getCharacterGear($gearState, character)
        useHighlighting = $gearState.highlightAny
    }
</script>

{#each characterGear as gear}
    <Item
        {gear}
        {useHighlighting}
    />
{/each}
