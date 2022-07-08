<script lang="ts">
    import { staticStore } from '@/stores'
    import { Gender } from '@/types/enums'
    import type { Character } from '@/types'
    import type { StaticDataCharacterRace } from '@/types/data/static/character'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character = undefined
    export let characterRace: StaticDataCharacterRace = undefined
    export let gender = 0
    export let raceId = 0
    export let size = 20
    export let border = 1

    let race: StaticDataCharacterRace
    let tooltip: string
    $: {
        race = characterRace || $staticStore.data.characterRaces[character?.raceId || raceId]
        tooltip = `${Gender[character?.gender || gender]} ${race?.name ?? 'Unknown'}`
    }
</script>

<WowthingImage
    name="race_{race.id}_{character?.gender ?? 0}"
    {size}
    {border}
    {tooltip}
/>
