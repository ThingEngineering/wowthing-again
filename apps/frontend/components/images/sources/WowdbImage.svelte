<script lang="ts">
    import type { TippyProps } from '@/types'

    import Image from '../Image.svelte'

    export let name: string
    export let size: string
    export let border = 0
    export let cls: string = undefined
    export let tooltip: TippyProps | string = undefined

    const actualSize = (size === 'large' ? 56 : size === 'medium' ? 36 : 16)
</script>

<Image
    src="https://icons.wowdb.com/retail/{size}/{name}.jpg"
    alt={name}
    size={actualSize}
    {border}
    {cls}
    {tooltip}
/>
