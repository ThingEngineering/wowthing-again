<script lang="ts">
    import type { MythicPlusAffix } from '@/types'
    import { affixMap } from '@/data/dungeon'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let affix: MythicPlusAffix = undefined
    export let affixId = 0
    export let size = 20
    export let border = 1

    $: {
        affix = affix || affixMap[affixId]
    }
</script>

<WowthingImage
    name="affix_{affix.id}"
    tooltip={affix.name}
    {size}
    {border}
/>
