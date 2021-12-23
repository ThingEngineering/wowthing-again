<script lang="ts">
    import { raceMap } from '@/data/character-race'
    import { Gender } from '@/types/enums'
    import type { Character, CharacterRace } from '@/types'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character = undefined
    export let characterRace: CharacterRace = undefined
    export let gender = 0
    export let raceId = 0
    export let size = 20
    export let border = 1

    let iconName: string
    let tooltip: string

    $: {
        const race: CharacterRace = characterRace || raceMap[character?.raceId || raceId]
        iconName = race?.icons[character?.gender || gender] ?? 'unknown_race'
        tooltip = `${Gender[character?.gender || gender]} ${race?.name ?? 'Unknown'}`
    }
</script>

<WowthingImage
    name={iconName}
    {size}
    {border}
    {tooltip}
/>
