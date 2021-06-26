<script lang="ts">
    import type { TippyProps } from '@/types'
    import tippy from '@/utils/tippy'

    export let src: string
    export let alt: string
    export let size = 0
    export let border = 0
    export let cls: string = undefined
    export let tooltip: TippyProps | string = undefined

    const actualSize = size + border * 2
</script>

<style lang="scss">
    img {
        border-color: var(--icon-border-color, $border-color);
        border-radius: var(--icon-border-radius, $border-radius);
        border-style: solid;
        border-width: var(--icon-border-width, 0);
        margin-top: var(--icon-margin-top, 0);
    }
</style>

<img
    src={src}
    class={cls}
    width={actualSize}
    height={actualSize}
    alt={alt}
    loading="lazy"
    use:tippy={tooltip}
/>
