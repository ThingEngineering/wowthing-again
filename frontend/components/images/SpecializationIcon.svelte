<script lang="ts">
    import { specializationMap } from '@/data/character-specialization'
    import type { Character, CharacterSpecialization } from '@/types'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character
    export let size: number
    export let border = 1

    let iconName: string
    let tooltip: string
    $: {
        const spec: CharacterSpecialization =
            specializationMap[character.activeSpecId]
        iconName = spec?.icon ?? 'spec_unknown'
        tooltip = spec?.name ?? 'Unknown'
    }
</script>

<WowthingImage name={iconName} {size} {tooltip} {border} />
