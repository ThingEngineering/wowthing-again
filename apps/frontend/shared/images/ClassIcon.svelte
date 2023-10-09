<script lang="ts">
    import { staticStore } from '@/stores'
    import { getGenderedName } from '@/utils/get-gendered-name'
    import type { Character } from '@/types'
    import type { StaticDataCharacterClass } from '@/types/data/static/character'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let character: Character = undefined
    export let characterClass: StaticDataCharacterClass = undefined
    export let classId = 0
    export let size = 20
    export let border = 1
    export let useTooltip = true

    let cls: StaticDataCharacterClass
    let tooltip: string
    $: {
        cls = characterClass || $staticStore.characterClasses[character?.classId ?? classId]
        if (useTooltip) {
            tooltip = getGenderedName(cls?.name ?? `Unknown class`, character?.gender ?? 0)
        }
    }
</script>

<WowthingImage
    name="class/{cls.id}"
    {border}
    {size}
    {tooltip}
/>
