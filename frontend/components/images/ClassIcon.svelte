<script lang="ts">
    import { classMap } from '@/data/character-class'
    import type { Character, CharacterClass } from '@/types'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character
    export let size: number

    let iconName: string
    let tooltip: string
    $: {
        const cls: CharacterClass = classMap[character.classId]
        iconName = cls?.icon ?? 'race_unknown'
        tooltip = cls?.name ?? 'Unknown'
    }
</script>

<WowthingImage name={iconName} {size} border={1} {tooltip} />
