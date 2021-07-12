<script lang="ts">
    import type {TippyProps} from '@/types'

    import Icon from '../Icon.svelte'

    export let name: string
    export let size: number
    export let border = 0
    export let cls: string = undefined
    export let tooltip: TippyProps | string = undefined

    const actualSize = size + (border * 2)
</script>

<picture>
    <source srcset="https://img.wowthing.org/{size}/{name}.webp" type="image/webp">
    <Icon
        src="https://img.wowthing.org/{size}/{name}.png"
        alt={name}
        size={actualSize}
        {cls}
        {tooltip}
    />
</picture>
