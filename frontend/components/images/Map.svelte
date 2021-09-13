<script lang="ts">
    import type { TippyProps } from '@/types'

    export let name: string
    export let alt: string
    export let border = 0
    export let height = 0
    export let width = 0
    export let cls: string = undefined
    export let tooltip: TippyProps | string = undefined

    const actualHeight = height + (border * 2)
    const actualWidth = width + (border * 2)

    import Image from './Image.svelte'
</script>

<Image
    src="https://img.wowthing.org/maps/{name}_{width}_{height}.webp"
    width={actualWidth}
    height={actualHeight}
    {alt}
    {cls}
    {tooltip}
/>
