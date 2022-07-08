<script lang="ts">
    import { staticStore } from '@/stores'
    import type { Character } from '@/types'
    import type { StaticDataCharacterClass } from '@/types/data/static/character'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character = undefined
    export let characterClass: StaticDataCharacterClass = undefined
    export let classId = 0
    export let size = 20
    export let border = 1

    let cls: StaticDataCharacterClass
    let tooltip: string
    $: {
        cls = characterClass || $staticStore.data.characterClasses[character?.classId ?? classId]
        tooltip = cls?.name ?? `Unknown class`
    }
</script>

<WowthingImage
    name="class/{cls.id}"
    {border}
    {size}
    {tooltip}
/>
