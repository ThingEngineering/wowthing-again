<script lang="ts">
    import tippy from '@/utils/tippy'
    import type { IconifyIcon } from '@iconify/types'

    export let dropShadow = false
    export let extraClass: string = undefined
    export let icon: IconifyIcon
    export let scale: string = null
    export let tooltip: string = undefined
</script>

<style lang="scss">
    svg {
        height: 24px;
        margin-top: var(--image-margin-top, 0);
        width: 24px;
        transform: scale(var(--scale, 1));
    }
</style>

<svg
    style:--scale={scale}
    viewBox="0 0 {icon.width} {icon.height}"
    aria-hidden="true"
    role="img"
    class="{extraClass}"
    class:drop-shadow={dropShadow}
    use:tippy={tooltip}
>
    {@html icon.body}
</svg>
