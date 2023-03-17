<script lang="ts">
    import type { StaticDataKeystoneAffix } from '@/types/data/static'

    import WowthingImage from './sources/WowthingImage.svelte'

    export let affix: StaticDataKeystoneAffix = undefined
    export let affixId = 0
    export let size = 20
    export let border = 1
</script>

<WowthingImage
    name="affix/{affix?.id || affixId}"
    tooltip={affix.name}
    {size}
    {border}
/>
