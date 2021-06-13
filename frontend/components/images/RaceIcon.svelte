<script lang="ts">
    import { raceMap } from '@/data/character-race'
    import type { Character, CharacterRace } from '@/types'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character
    export let size: number

    let iconName: string
    let tooltip: string

    $: {
        const race: CharacterRace = raceMap[character.raceId]
        iconName = race?.icons[character.gender] ?? 'unknown_race'
        tooltip = `${['Female', 'Male'][character.gender]} ${
            race?.name ?? 'Unknown'
        }`
    }
</script>

<WowthingImage name={iconName} {size} border={1} {tooltip} />
