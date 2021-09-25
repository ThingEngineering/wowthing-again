<script lang="ts">
    import { classMap, classNameMap } from '@/data/character-class'
    import type { Character, CharacterClass } from '@/types'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character = undefined
    export let characterClass: CharacterClass = undefined
    export let classId = 0
    export let className = ''
    export let size = 20
    export let border = 1

    let iconName: string
    let tooltip: string
    $: {
        const cls: CharacterClass = characterClass ||
            classMap[character?.classId ?? classId] ||
            classNameMap[className]
        iconName = cls?.icon ?? 'race_unknown'
        tooltip = cls?.name ?? 'Unknown'
    }
</script>

<WowthingImage name={iconName} {size} {border} {tooltip} />
