<script lang="ts">
    import type { TippyProps } from '@/types'
    import tippy from '@/utils/tippy'

    export let src: string
    export let alt: string
    export let border = 0
    export let height = 0
    export let size = 0
    export let width = 0
    export let cls: string = undefined
    export let tooltip: TippyProps | string = undefined

    const actualHeight = (height || size) + (border * 2)
    const actualWidth = (width || size) + (border * 2)
</script>

<style lang="scss">
    img {
        border-color: var(--image-border-color, $border-color);
        border-radius: var(--image-border-radius, $border-radius);
        border-style: solid;
        border-width: var(--image-border-width, 0);
        margin-top: var(--image-margin-top, 0);
    }
</style>

<img
    src={src}
    class={cls}
    width={actualWidth}
    height={actualHeight}
    alt={alt}
    loading="lazy"
    use:tippy={tooltip}
/>
