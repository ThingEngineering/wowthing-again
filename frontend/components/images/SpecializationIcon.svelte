<script lang="ts">
    import { specializationMap } from '@/data/character-specialization'
    import type { Character, CharacterSpecialization } from '@/types'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character = undefined
    export let characterSpec: CharacterSpecialization = undefined
    export let specId = 0
    export let size = 20
    export let border = 1

    let iconName: string
    let tooltip: string
    $: {
        const spec: CharacterSpecialization = characterSpec || specializationMap[character?.activeSpecId || specId]
        iconName = spec?.icon ?? 'spec_unknown'
        tooltip = spec?.name ?? 'Unknown'
    }
</script>

<WowthingImage name={iconName} {size} {border} {tooltip} />
